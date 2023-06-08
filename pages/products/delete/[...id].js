import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RemoveProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();

    const { id } = router.query;

    // use effect 
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/product/products?id=' + id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct() {
        await axios.delete('/api/product/products?id=' + id);
        goBack();
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to remove this product ?
                &nbsp;&quot;{productInfo?.title}&quot;?
            </h1>
            <div className="flex gap-2 justify-center">
                <button
                    onClick={deleteProduct}
                    className="btn-red">Yes Remove</button>
                <button
                    className="btn-default"
                    onClick={goBack}>
                    No
                </button>
            </div>
        </Layout>
    );
}
