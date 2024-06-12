import { useTable } from '@refinedev/core';
import React from 'react'
interface IProduct {
    id: number;
    name: string;
    price: string;
}

const TestTable = () => {
    const { 
        tableQueryResult: tableData, 
        pageCount, 
        pageSize, 
        current, 
        setCurrent 
    } = useTable<IProduct>({
        resource: "pg_entity",
        meta: {
            select: '*',
            schema : "caps"
        },
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const posts = tableData?.data?.data ?? [];
    console.log(posts, 'jdcyibcc');

    if (tableData?.isLoading) {
        return <div>Loading...</div>;
    }
    return (

        <div style={{ padding: "8px" }}>
            <h1>Products</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.name}</td>
                            <td>{post.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <p>Current Page: {current}</p>
            <p>Page Size: {pageSize}</p>
            <button
                onClick={() => {
                    setCurrent(current - 1);
                }}
                disabled={current < 2}
            >
                Previous Page
            </button>
            <button
                onClick={() => {
                    setCurrent(current + 1);
                }}
                disabled={current === pageCount}
            >
                Next Page
            </button>
        </div>
    );

}

export default TestTable


TestTable.requireAuth = false