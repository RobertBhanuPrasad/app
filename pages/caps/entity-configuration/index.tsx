import { customFetch } from "../../../src/utility/custom-fetch";
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
import { X } from "lucide-react";
import ErrorAlerts from "@components/ErrorAlert";


const schema = z.object({

});
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

const checkEntityQueryParam = async (entityId: number): Promise<boolean> => {
    const supabase = supabaseClient("caps");
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
            customFetch("/rest/v1/payment_gateways", "GET", null, [["select", "id,type,name,description,test,transaction_intent"], ["order", "id"]])
                .then(response => response.json())
                .then(list => {
                    const _gateways: Gateway[] = [];
                    list.forEach((gateway: any) => {
                        _gateways.push({
                            id: gateway.id,
                            type: gateway.type.charAt(0).toUpperCase() + gateway.type.substring(1).toLowerCase(),
                            name: gateway.name,
                            description: gateway.description,
                            test: gateway.test ? "test" : "live",
                            purpose: gateway.transaction_intent ? "for refund" : "for sale",
                        })
                    });
                    if (_gateways.length > 0) {
                        setAllGateways(_gateways);
                    }
                })
                .catch(err => setAlert({ title: "Oops!", description: "Something went wrong : " + err }));

            // then fetch the gateways set for this entity
            customFetch("/rest/v1/pg_mapping", "GET", null, [["entity_id", "eq." + _entity], ["select", "pg_id"], ["order", "sort_order"]])
                .then(response => response.json())
                .then(list => setSelectedIds(list))
                .catch(err => setAlert({ title: "Oops!", description: "Something went wrong : " + err }));

            // fetch external enpoints config for this entity
            customFetch("/rest/v1/pg_external_endpoints", "GET", null, [["entity", "eq." + _entity], ["select", "id,internal_status,external_endpoint,headers"], ["order", "internal_status"]])
                .then(response => response.json())
                .then(list => {
                    const _endpoints: EndPoint[] = [];
                    list.forEach((endpoint: any) => {
                        _endpoints.push({
                            ...endpoint,
                            compressedHeaders: endpoint.headers ? compress(endpoint.headers) : null
                        })
                    });
                    setExternalEndpoints(_endpoints);
                })
                .catch(err => setAlert({ title: "Oops!", description: "Something went wrong while fetching external endpoints config : " + err }));
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
            <ErrorAlerts title={props.title} description={props.description} onClose = {()=>setAlert(undefined)}/>
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

        // delete previous mapping
        // , ["pg_id", "not.in.(" + selectedIds.map(({ pg_id }) => pg_id) + ")"]
        let response = await customFetch('/rest/v1/pg_mapping', "DELETE", null, [["entity_id", "eq." + entity]]);

        if (!response.ok) {
            setAlert({ title: "Delete Error", description: "Could not delete entries for payment_gateways configuration. Please try again after some time." });
            return;
        }

        // inser new mapping
        // [["Prefer", "resolution=merge-duplicates"]]
        response = await customFetch('/rest/v1/pg_mapping', 'POST', selectedIds.map(({ pg_id }, index) => ({
            entity_id: entity,
            pg_id,
            sort_order: index + 1
        })));

        if (!response.ok) {
            setAlert({ title: "Creation Error", description: "Could not create entries for payment_gateways configuration. Please try again after some time." });
            return;
        }

        // update pg_external_endpoints
        response = await customFetch('/rest/v1/pg_external_endpoints', 'POST', externalEndpoints.map(endpoint => {
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
        }), undefined, [["Prefer", "resolution=merge-duplicates"]]);

        if (!response.ok) {
            setAlert({ title: "Update Error", description: "Could not update entries for external_endpoints configuration. Please try again after some time." });
            return;
        }

        window.location.reload();
    }

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
                            return <option value={index}>{gateway.name}</option>
                            // if (!selectedIds.find(pg => pg.pg_id === gateway.id)) {
                            //     return <option value={index}>
                            //         {shorten(gateway.name)} | {shorten(gateway.description, 30)} | {shorten(gateway.type, 10)} | {gateway.test} | {shorten(gateway.purpose, 10)}
                            //     </option>
                            // }
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
