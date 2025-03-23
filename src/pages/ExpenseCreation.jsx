import React, { useEffect, useState, useRef } from 'react';
import service from '../appwrite/conf';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import Loading from './Loading';

const ExpenseCreation = () => {
  console.log("Rendering Layout Component");
  const { user_id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expense, setExpense] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true)
      try {
        const response = await service.readAll(user_id);
        console.log(response);
        if (response && response.documents) {
          setExpenses(response.documents);
        } else {
          console.error("Invalid response structure:", response);
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setLoading(false)
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

  const newExpense = async (e) => {
    setLoading(true)
    e.preventDefault();
    const data = {
      user_id: user_id,
      title: title,
      expenselimit: parseInt(expense) || 0,
      expenditure: parseInt(expenditure) || 0,
    };
    try {
      console.log("Submitting data:", data);
      const response = await service.createExpenses(data);
      if (response) {
        setExpenses((prev) => [...prev, response]);
        resetModal();
      }
      setLoading(false)
    } catch (error) {
      console.log("Error in creating an expense", error);
      setLoading(false)
    }
  };

  const updateExpense = async (e) => {
    e.preventDefault();
    const data = {
      user_id: user_id,
      title: title,
      expenselimit: parseInt(expense) || 0,
      expenditure: parseInt(expenditure) || 0,
    };
    try {
      console.log("Updating expense:", data);
      const response = await service.updateExpense(editingExpenseId, data);
      if (response) {
        setExpenses((prev) =>
          prev.map((exp) => (exp.$id === editingExpenseId ? response : exp))
        );
        resetModal();
      }
    } catch (error) {
      console.log("Error updating expense", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(expenditure) > parseInt(expense)) {
      setError("Expenditure should not exceed expense");
      setExpenditure("");
      return;
    } else {
      setError("");
      isEditing ? updateExpense(e) : newExpense(e);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await service.deleteExpense(expenseId);
      setExpenses((prevExp) => prevExp.filter((exp) => exp.$id !== expenseId));
    } catch (error) {
      console.log("Error deleting expense", error);
    }
  };

  const onAdd = () => {
    setIsEditing(false);
    setModalOpen(true);
  };

  const openUpdateModal = (exp) => {
    setIsEditing(true);
    setEditingExpenseId(exp.$id);
    setTitle(exp.title);
    setExpense(exp.expenselimit);
    setExpenditure(exp.expenditure);
    setModalOpen(true);
  };

   return (
    <div className="min-h-screen bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Your Expenses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {expenses.map((exp) => (
            <div key={exp.$id} className="card bg-white shadow-md p-4 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
              <p className="text-gray-600">Budget: {exp.expenselimit}</p>
              <p className="text-gray-600">Expenditure: {exp.expenditure}</p>
              <div className="flex justify-end mt-4 gap-3">
                <button className="btn btn-error btn-sm" onClick={() => deleteExpense(exp.$id)}>
                  <RiDeleteBin6Line />
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => openUpdateModal(exp)}>
                  <GrUpdate />
                </button>
              </div>
            </div>
          ))}
          <div
            className="card bg-white shadow-md flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer rounded-xl p-6 hover:bg-gray-100 transition"
            onClick={onAdd}
          >
            <FaPlus size={32} className="text-gray-400" />
          </div>
        </div>
      </div>

      {modalOpen && (
        <dialog ref={dialogRef} className="modal modal-open">
          <div className="modal-box bg-white shadow-lg rounded-lg p-6">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={resetModal}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-center">
              {isEditing ? "Update Expense" : "Add New Expense"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Budget"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
              />
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Expenditure"
                value={expenditure}
                onChange={(e) => setExpenditure(e.target.value)}
              />
              {error && <div className="alert alert-error">{error}</div>}
              <button className="btn btn-primary w-full" type="submit">
                {isEditing ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ExpenseCreation;
