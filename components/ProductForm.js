import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    category: assignCategory,
    properties: assignProperties
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignCategory || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [productProperties, setProductProperties] = useState(assignProperties || {});
    const [categories, setCategories] = useState([]);
    const [goToProducts, setGotoProducts] = useState(false);

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/product/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    // functions
    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title, description, price, category,
            properties: productProperties
        };
        if (_id) {
            //update
            await axios.put('/api/product/products', { ...data, _id });
        } else {
            //create
            await axios.post('/api/product/products', data);
        }
        setGotoProducts(true);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" placeholder="product name" value={title} onChange={ev => setTitle(ev.target.value)} />

            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}><option value="">Uncategorized</option><option value="2">2</option>
                {categories.length > 0 && categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>


            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]}
                            onChange={ev =>
                                setProductProp(p.name, ev.target.value)
                            }
                        >
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Description</label>
            <textarea placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>

            <label>Price (in USD)</label>
            <input type="number" placeholder="price" value={price} onChange={ev => setPrice(ev.target.value)} />

            <button type="submit" className="bg-blue-800 btn-primary">Add to the List</button>
        </form>
    );
}