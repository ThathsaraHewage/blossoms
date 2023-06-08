import { Product } from "../../../models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    // list all products
    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        }
        else {
            res.json(await Product.find());
        }
    }

    // insert product
    if (method === 'POST') {
        const { title, description, price, category, properties } = req.body;
        const productDoc = await Product.create({
            title, description, price, category, properties,
        })
        console.log(productDoc);
        res.json(productDoc);
    }

    // update product
    if (method === 'PUT') {
        const { title, description, price, category, properties, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, price, category, properties });
        res.json(true);
    }

    // delete product
    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}