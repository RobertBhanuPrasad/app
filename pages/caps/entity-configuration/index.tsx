import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "src/ui/alert";
import { Button } from "src/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "src/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { supabaseClient } from "src/utility";
import ErrorAlerts from "@components/ErrorAlert";
import _ from "lodash";


const schema = z.object({});
type FormValues = z.infer<typeof schema>;

type Gateway = {
    id: number;
    type: string;
    name: string;
    description: string;
    test: string;
    purpose: string;
};

type PGID = {
    pg_id: number;
}

type CustomAlert = { title: string; description: string };

type EndPoint = {
    id: number;
    internal_status: string;
    external_endpoint: string | null;
    headers: { name: string; value: string }[] | null;
    compressedHeaders: string | null;
};
const supabase = supabaseClient("caps");
const checkEntityQueryParam = async (entityId: number): Promise<boolean> => {

    const { data, error } = await supabase
        .from('pg_entity')
        .select('id')
        .eq('id', entityId)
        .limit(1);
    console.log('Supabase Data:', data);
    console.log('Supabase Error:', error);
    if (error) {
        console.error('Error checking entity existence:', error);
        return false;
    }

    return data.length > 0;
};

const entityQueryParam = async (id: string | string[] | undefined) => {
    const idString = Array.isArray(id) ? id[0] : id;
    console.log('ID is :', idString);
    if (idString && /^[1-9][0-9]*$/.test(idString)) {
        const idNumber = parseInt(idString, 10);
        if (await checkEntityQueryParam(idNumber)) {
            return { exists: true, id: idNumber } as const;
        }
    } else if (!idString) {
        return { exists: undefined };
    }
    return { exists: false, id: idString } as const;
};


const EntityConfig = () => {
    const router = useRouter();
    const [entity, setEntity] = useState<number>()
    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            let _entity = entity;
            try {
                const { id, exists } = await entityQueryParam(router.query.id);
                if (exists) {
                    setEntity(id);
                    _entity = id;
                    setLoading(false)
                } else if (exists === false) {
                    router.push("/caps/add-entity?" + new URLSearchParams([["error", "Invalid entity-id: " + id]]))
                }
            } catch (error) {
                router.push("/caps/add-entity?" + new URLSearchParams([["error", "Error fetching data:" + error]]))
            }
            // first fetch all the gateways
            const fetchPaymentGateways = async () => {
                try {
                    setLoading(true)
                    const { data, error } = await supabase
                        .from('payment_gateways')
                        .select('id,type,name,description,test,transaction_intent')
                        .order('id', { ascending: true });
                    // Handle any errors
                    if (error) {
                        throw error;
                    }
                    const _gateways = data.map(gateway => ({
                        id: gateway.id,
                        type: gateway.type.charAt(0).toUpperCase() + gateway.type.substring(1).toLowerCase(),
                        name: gateway.name,
                        description: gateway.description,
                        test: gateway.test ? "test" : "live",
                        purpose: gateway.transaction_intent ? "for refund" : "for sale",
                    }));
                    // Set the gateways if data is available
                    if (_gateways.length > 0) {
                        setAllGateways(_gateways);
                        setLoading(false)
                    }
                } catch (err: any) {
                    let errorMessage = "Something went wrong";

                    // Extracting the error message
                    if (err instanceof Error) {
                        errorMessage += ": " + err.message;
                    } else if (err && typeof err.message === 'string') {
                        errorMessage += ": " + err.message;
                    } else {
                        errorMessage += ": An unknown error occurred.";
                    }

                    setAlert({ title: "Oops!", description: errorMessage });
                }
            }

            fetchPaymentGateways();

            // then fetch the gateways set for this entity
            const fetchPGMapping = async (_entity: any) => {
                try {
                    const { data, error } = await supabase
                        .from('pg_mapping')
                        .select('pg_id')
                        .eq('entity_id', _entity)
                        .order('sort_order', { ascending: true });
                    if (error) {
                        throw error;
                    }

                    setSelectedIds(data);
                } catch (err: any) {
                    let errorMessage = "Something went wrong";

                    // Extracting the error message
                    if (err instanceof Error) {
                        errorMessage += ": " + err.message;
                    } else if (err && typeof err.message === 'string') {
                        errorMessage += ": " + err.message;
                    } else {
                        errorMessage += ": An unknown error occurred.";
                    }

                    setAlert({ title: "Oops!", description: errorMessage });
                }
            }
            fetchPGMapping(_entity);

            // fetch external enpoints config for this entity
            const fetchExternalEndpoints = async (_entity: any) => {
                try {
                    const {data, error} = await supabase
                        .from('pg_external_endpoints')
                        .select('id,internal_status,external_endpoint,headers')
                        .eq('entity', _entity)
                        .order('internal_status', { ascending: true });

                    if (error) {
                        throw error;
                    }
                    const _endpoints = data.map(endpoint => ({
                        ...endpoint,
                        compressedHeaders: endpoint.headers ? compress(endpoint.headers) : null
                    }));
            
                    setExternalEndpoints(_endpoints);
                } catch (err: any) {
                    let errorMessage = "Something went wrong while fetching external endpoints config";
            
                    // Extracting the error message
                    if (err instanceof Error) {
                        errorMessage += ": " + err.message;
                    } else if (err && typeof err.message === 'string') {
                        errorMessage += ": " + err.message;
                    } else {
                        errorMessage += ": An unknown error occurred.";
                    }
            
                    setAlert({ title: "Oops!", description: errorMessage });
                }
           }
           fetchExternalEndpoints(_entity)

        };

        fetchData()
    }, [router.query.id]);

    const { } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const [allGateways, setAllGateways] = useState<Gateway[]>();
    const [selectedIds, setSelectedIds] = useState<PGID[]>();
    const [selectedValue, setSelectedValue] = useState<number>(-1);
    const [externalEndpoints, setExternalEndpoints] = useState<EndPoint[]>();
    const [alert, setAlert] = useState<CustomAlert>();

    const AlertDestructive = (props: CustomAlert) => {
        return (
            <ErrorAlerts title={props.title} description={props.description} onClose={() => setAlert(undefined)} />
        )
    }
    const unselectPG = (index: number) => {
        if (!selectedIds) return;

        const _selectedIds = [...selectedIds];
        _selectedIds.splice(index, 1);
        setSelectedIds(_selectedIds);
    }

    const selectPG = (_index: string) => {
        if (!allGateways || !selectedIds) return;
        const index = parseInt(_index, 10);

        setSelectedIds([...selectedIds, { pg_id: allGateways[index].id }]);
    }

    const updateEndpoint = (index: number, endpoint: EndPoint) => {
        if (!externalEndpoints) return;
        const _endpoints = [...externalEndpoints];
        _endpoints[index] = endpoint;
        setExternalEndpoints(_endpoints);
    }

    const updateConfig = async () => {
        if (!selectedIds || !externalEndpoints) return;
    
        try {
            // Delete previous mappings
            const deleteMappingResponse = await supabase
                .from('pg_mapping')
                .delete()
                .eq('entity_id', entity);
    
            if (!deleteMappingResponse) {
                throw new Error("Could not delete entries for payment_gateways configuration. Please try again after some time.");
            }
    
            // Insert new mappings
            const insertMappingResponse = await supabase
                .from('pg_mapping')
                .insert(selectedIds.map(({ pg_id }, index) => ({
                    entity_id: entity,
                    pg_id,
                    sort_order: index + 1
                })));
    
            if (!insertMappingResponse) {
                throw new Error("Could not create entries for payment_gateways configuration. Please try again after some time.");
            }
    
            // Update pg_external_endpoints
            const updateEndpointsResponse = await supabase
                .from('pg_external_endpoints')
                .upsert(externalEndpoints.map(endpoint => {
                    if (endpoint.compressedHeaders) {
                        try {
                            endpoint.headers = expand(endpoint.compressedHeaders);
                        } catch { }
                    }
    
                    return {
                        id: endpoint.id,
                        entity: entity,
                        internal_status: endpoint.internal_status,
                        external_endpoint: endpoint.external_endpoint,
                        headers: endpoint.headers
                    };
                }), { onConflict: 'id'});
    
            if (!updateEndpointsResponse) {
                throw new Error("Could not update entries for external_endpoints configuration. Please try again after some time.");
            }
    
            window.location.reload();
        } catch (error: any) {
            setAlert({ title: "Error", description: error.message });
        }
    };
    

    if (isLoading) {
        return <section className="flex justify-center align-center pt-[10%]"> <div className="loader"></div> </section>
    }

    return (

        <form className="px-4 pb-4" autoComplete="off" onSubmit={(e) => {
            e.preventDefault();
            updateConfig()
        }}>
            <div style={{ display: "flex" }}>
                <div className="pd-5 text-center bg-body-tertiary" style={{ marginLeft: "30em" }}>
                    <h1 className="mb-3">Entity Configuration</h1>
                </div>
                <Alert id="entity-alert" className="alert alert-success py-1 text-center" style={{ width: "9em", marginLeft: "auto" }}>
                    <AlertTitle>Entity ID</AlertTitle>
                    <AlertDescription>#{entity}</AlertDescription>
                </Alert>
            </div>
            <div className="pd-5 bg-body-tertiary">
                <h5 className="mb-3">Payment Gateways Configuration</h5>
            </div>

            {alert && <AlertDestructive {...alert} />}
            {allGateways && selectedIds && <>
                {selectedIds.length > 0 && (<Table className="table-bordered centered-content">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>PG Type</TableHead>
                            <TableHead>Test/Live</TableHead>
                            <TableHead>Gateway Purpose</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedIds.map((pgId, index) => {
                            const gateway = allGateways.find(g => g.id === pgId.pg_id);
                            if (!gateway) return null;
                            return (
                                <TableRow>
                                    <TableCell>{gateway.name}</TableCell>
                                    <TableCell>{gateway.description}</TableCell>
                                    <TableCell>{gateway.type}</TableCell>
                                    <TableCell>{gateway.test}</TableCell>
                                    <TableCell>{gateway.purpose}</TableCell>
                                    <TableCell className="text-center ">
                                        <button type="button" className="btn btn-btn-outline-primary " onClick={() => unselectPG(index)}>❌</button>
                                    </TableCell>
                                </TableRow>);
                        })
                        }
                    </TableBody>
                </Table>)}

                <div className="form-group pb-3 pt-3">
                    <select className="form-select border-dark " onChange={(e) => { selectPG(e.target.value); setSelectedValue(-1) }} value={selectedValue} style={{ fontFamily: "monospace" }}>
                        <option value={-1} disabled>--- choose which gateways to allow for this entity ---</option>
                            {allGateways.map((gateway, index) => {
                            if (!selectedIds.find(pg => pg.pg_id === gateway.id)) {
                                console.log(selectedIds,'All Gateways');
                                
                                return <option value={index}>
                                    {shorten(gateway.name)} | {shorten(gateway.description, 30)} | {shorten(gateway.type, 10)} | {gateway.test} | {shorten(gateway.purpose, 10)}
                                </option>
                            }
                        })
                        }
                    </select>
                </div>
            </>
            }

            <div className="pt-4 pd-5 bg-body-tertiary">
                <h5 className="mb-3">External Endpoints Configuration</h5>
            </div>


            < Table className="table-bordered centered-content" >
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: "13em" }}>Status</TableHead>
                        <TableHead style={{ width: "30em" }}>URL</TableHead>
                        <TableHead style={{ width: "40em" }}>Headers</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {externalEndpoints && externalEndpoints.map((endpoint, index) => (<TableRow>
                        <TableCell>{endpoint.internal_status}</TableCell>
                        <TableCell><input className="form-control" type="text" value={endpoint.external_endpoint || undefined} placeholder={`https://www.example.com/${endpoint.internal_status}`} onChange={(e) => updateEndpoint(index, { ...endpoint, external_endpoint: e.target.value })} /></TableCell>
                        <TableCell><input className="form-control" type="text" value={endpoint.compressedHeaders || undefined} placeholder='"apikey":"1a54fxx";"content-type":"application/json";"user-agent":"caps-be"' onChange={(e) => updateEndpoint(index, { ...endpoint, compressedHeaders: e.target.value })} /></TableCell>
                    </TableRow>))}
                </TableBody>
            </Table >

            <div className="pt-4 text-center">
                <div className="pt-4 text-center">
                    <Button type="submit">Submit</Button>
                </div>
            </div>

        </form >
    )
}

export default EntityConfig

EntityConfig.requireAuth = true

function shorten(text: string | null, maxLen: number = 20) {
    text = text ? text : "";

    if (text.length > maxLen) {
        return text.substring(0, maxLen - 3) + '...';
    }
    const remaining = maxLen - text.length;
    return (repeat(Math.floor(remaining / 2)) + text + repeat(remaining - Math.floor(remaining / 2)))
}

function repeat(times: number, char: string = '\u00a0') {
    if (times <= 0) return '';
    return Array(times + 1).join(char);
}

function compress(headers: { name: string; value: string }[]) {
    const compressedHeaders = headers.map(item => `"${item.name}":"${item.value}"`).join(';');
    return compressedHeaders;
}

function expand(compressedHeaders: string) {
    const keyValuePairs: string[] = [];
    compressedHeaders.split(';').forEach(s => { if (!s.match(/^\s*$/)) keyValuePairs.push(s); });
    const headers = keyValuePairs.map(pair => {
        const [name, value] = pair.split(':').map(item => item.replace(/"/g, '').trim());
        return { name, value };
    });

    return headers;
}
