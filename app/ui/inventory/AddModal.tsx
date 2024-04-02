'use client'
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { AmountType } from "@/app/utils/interfaces";

interface Category {
    cid: number;
}

// modal for adding a new category using Modal component
const AddModal: React.FC<Category> = ({ cid }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ingredientName, setIngredientName] = useState('' as string);
    const [expiration, setExpiration] = useState(null as Date | null);
    const [amount, setAmount] = useState('' as string);
    const [amountType, setAmountType] = useState(AmountType.GRAM);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('../../api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredient_name: ingredientName, expiration: expiration, amount: amount, amount_type: amountType, cid: cid }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message === 'Ingredient successfully added') {
                    closeModal();
                    setIngredientName('');
                    setAmount('');
                }
                window.location.href = "/pages/signedIn/inventory"
            }
            else {
                const res = await response.json();
                console.error("Error adding ingredient: ", res.error);
            }
        }
        catch (error) {
            console.error("Error adding ingredient: ", error);
        }
    };

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={openModal}>
                Add Ingredient
            </button>
            <Modal modalTitle="Add Ingredient" isOpen={isOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="ingredient">Ingredient Name: </label>
                    <input
                        type="text"
                        id="ingredient"
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                    /> <br />
                    <label htmlFor="expiration">Expiration Date: </label>
                    <input
                        type="date"
                        id="expiration"
                        onChange={(e) => setExpiration(new Date(e.target.value))}
                    /> <br />
                    <label htmlFor="amount">Amount: </label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select name="amountType" id="amountType" value={amountType} onChange={(e) => setAmountType(e.target.value as AmountType)}>
                        {Object.values(AmountType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <br />
                    <button type="submit">Add</button><br></br>
                    <button onClick={closeModal}>Close</button>
                </form>
            </Modal>
        </>
    );
};

export default AddModal;