import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";

export default function NewProduct() {
    return (
        <Layout>
            <h1>Add New Product</h1>
            <ProductForm />
        </Layout>
    );
}