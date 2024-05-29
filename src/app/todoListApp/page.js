"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const TodoListApp = () => {
  const queryClient = useQueryClient();
  // fetch todos
  const {
    data: todosData,
    isLoading: isTodosLoading,
    isError: isTodosError,
    isSuccess: isTodosSuccess,
  } = useQuery({
    queryKey: ["todosListApp"],
    queryFn: () => axios.get("http://localhost:3001/todos"),
  });

  // post data into todos
  const postMutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post("http://localhost:3001/todos", newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todosListApp"] });
    },
  });

  // delete data from todos
  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:3001/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todosListApp"] });
    },
  });

  // pacth data in todos
  const patchMutation = useMutation({
    mutationFn: (todo) => {
      return axios.patch(`http://localhost:3001/todos/${todo.id}`, todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todosListApp"] });
    },
  });

  // handle error
  if (isTodosError) return <p> Error</p>;

  // handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = {
      id: new Date(),
      title: e.target.title.value,
      description: e.target.description.value,
    };
    postMutation.mutate(newTodo);
    e.target.reset();
  };

  // handle delete
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Modal component
  const Modal = ({ todo }) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpenModal = (todo) => {
      if (todo === null || todo === undefined) {
        console.error("todo is null or undefined in handleOpenModal");
        return;
      }
      setTitle(todo.title ?? "");
      setDescription(todo.description ?? "");
      setIsOpen(true);
    };

    const handleCloseModal = () => setIsOpen(false);

    return (
      <>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => handleOpenModal(todo)}
        >
          Edit
        </button>
        {isOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto text-black"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
              <div className="fixed inset-x top-0 w-full z-10">
                <div
                  className="absolute inset-y-0 left-0 w-full bg-gray-500 opacity-50"
                  aria-hidden="true"
                ></div>
              </div>
              <div className="relative w-fit mx-auto bg-black rounded-lg shadow-xl border-2 border-white p-4">
                <div className="text-center">
                  <h3
                    className="text-lg text-white font-medium leading-6 uppercase"
                    id="modal-title"
                  >
                    Edit Todo Task
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      try {
                        patchMutation.mutate({
                          id: todo.id,
                          title,
                          description,
                        });
                      } catch (error) {
                        console.error(
                          "Error while submitting new todo task:",
                          error
                        );
                      }
                      handleCloseModal();
                      e.target.reset();
                    }}
                    className="flex flex-col"
                  >
                    <label className="my-2 text-white flex flex-col items-start">
                      Title:
                      <input
                        className="text-black p-2"
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </label>
                    <label className="my-2 text-white flex flex-col items-start">
                      Description:
                      <textarea
                        className="w-full text-black p-2"
                        name="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </label>
                    <div className="flex items-center justify-end gap-3 p-2">
                      <button
                        type="button"
                        className="bg-red-500 py-2 px-4 rounded-md text-white"
                        onClick={() => handleCloseModal()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 py-2 px-4 rounded-md text-white"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-black text-white flex flex-col justify-center items-center">
      <div>
        <h2 className="text-3xl font-bold uppercase mb-6">todo list app</h2>
        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 text-black"
        >
          <label className="text-xl">Add a task:</label>
          <input
            className="rounded-sm p-2"
            type="text"
            name="title"
            id="title"
            placeholder="task title"
          />
          <textarea
            className="rounded-sm p-2"
            name="description"
            id="description"
            placeholder="task description"
          />
          <button
            type="submit"
            className="bg-white text-black rounded-md hover:bg-gray-200 font-bold"
          >
            Add
          </button>
        </form>
        {/* todo list */}
        <div className="mt-6">
          {isTodosLoading && (
            <div className="h-[200px] w-full flex items-center justify-center text-2xl font-bold">
              The data is Loading...
            </div>
          )}
          {/* todo list card */}
          {todosData?.data?.map((todo) => (
            <div
              key={todo.id}
              className="bg-white shadow-md rounded-md overflow-hidden mb-4"
            >
              <div className="p-4">
                {/* todo title */}
                <h3 className="text-lg font-bold text-black uppercase">
                  {todo.title}
                </h3>
                {/* todo description */}
                <p className="text-gray-600">{todo.description}</p>
              </div>
              <div className="flex justify-between px-4 py-2 bg-gray-100">
                {/* edit button / opens modal */}
                <Modal todo={todo} />
                {/* delete button */}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoListApp;
