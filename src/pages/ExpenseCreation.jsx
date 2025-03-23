import React, { useEffect, useState, useRef } from 'react';
import service from '../appwrite/conf';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";

const ExpenseCreation = () => {
  console.log("Rendering Expense Creation");
  const { user_id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expense, setExpense] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await service.readAll(user_id);
        if (response && response.documents) {
          setExpenses(response.documents);
        } else {
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [user_id]);

  useEffect(() => {
    if (modalOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [modalOpen]);

  const resetModal = () => {
    setTitle("");
    setExpense("");
    setExpenditure("");
    setIsEditing(false);
    setEditingExpenseId(null);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(expenditure) > parseInt(expense)) {
      setError("Expenditure should not exceed budget");
      return;
    }

    const data = {
      user_id,
      title,
      expenselimit: parseInt(expense) || 0,
      expenditure: parseInt(expenditure) || 0,
    };

    try {
      let response;
      if (isEditing) {
        response = await service.updateExpense(editingExpenseId, data);
        setExpenses((prev) =>
          prev.map((exp) => (exp.$id === editingExpenseId ? response : exp))
        );
      } else {
        response = await service.createExpenses(data);
        setExpenses((prev) => [...prev, response]);
      }
      resetModal();
    } catch (error) {
      console.error("Error handling expense:", error);
    }
    setError("")
  };

  const deleteExpense = async (expenseId) => {
    try {
      await service.deleteExpense(expenseId);
      setExpenses((prevExp) => prevExp.filter((exp) => exp.$id !== expenseId));
    } catch (error) {
      console.log("Error deleting expense", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6] flex flex-col items-center p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {expenses.map((exp) => (
          <div key={exp.$id} className="card bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold">{exp.title}</h2>
            <p className="text-gray-600">Budget: <strong>₹{exp.expenselimit}</strong></p>
            <p className="text-gray-600">Expenditure: <strong>₹{exp.expenditure}</strong></p>
            <div className="flex justify-end gap-4 mt-4">
              <button className="btn btn-error" onClick={() => deleteExpense(exp.$id)}>
                <RiDeleteBin6Line />
              </button>
              <button className="btn btn-primary" onClick={() => {
                  setTitle(exp.title);
                  setExpense(exp.expenselimit);
                  setExpenditure(exp.expenditure);
                  setIsEditing(true);
                  setEditingExpenseId(exp.$id);
                  setModalOpen(true);
                }}>
                <GrUpdate />
              </button>
            </div>
          </div>
        ))}

        <div
          className="card flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer h-40"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus size={32} className="text-gray-400" />
        </div>
      </div>

      {modalOpen && (
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <button type="button" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={resetModal}>✕</button>
              <h3 className="text-2xl font-bold">{isEditing ? "Update Expense" : "Add New Expense"}</h3>
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" />
              <input type="number" placeholder="Budget" value={expense} onChange={(e) => setExpense(e.target.value)} className="input input-bordered w-full" />
              <input type="number" placeholder="Expenditure" value={expenditure} onChange={(e) => setExpenditure(e.target.value)} className="input input-bordered w-full" />
              {error && <p className="text-red-500">{error}</p>}
              <button type="submit" className="btn btn-primary">{isEditing ? "Update" : "Add"}</button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ExpenseCreation;
