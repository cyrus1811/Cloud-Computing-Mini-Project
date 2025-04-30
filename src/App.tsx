import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Trash2, Plus, LogOut, Shield, Zap } from "lucide-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    if (newTodoContent.trim()) {
      client.models.Todo.create({ content: newTodoContent });
      setNewTodoContent("");
    }
  }

  function deleteTodo(id: string, e) {
    e.stopPropagation();
    client.models.Todo.delete({ id });
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex justify-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="text-white h-6 w-6" />
            <h1 className="text-white font-bold text-xl tracking-tight">POWER TASKS</h1>
          </div>
          <button
            onClick={signOut}
            className="text-white bg-gray-800 bg-opacity-30 hover:bg-opacity-50 px-3 py-1 rounded-md flex items-center gap-1 text-sm transition-all duration-300"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Add Todo Input */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              onClick={createTodo}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg px-4 py-2 flex items-center gap-1 transition-all duration-300 shadow-lg shadow-blue-500/30"
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="p-5 overflow-y-auto max-h-96 bg-gray-900">
          {todos.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Zap size={56} className="mx-auto mb-3 text-gray-600 animate-pulse" />
              <p className="text-lg">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 flex justify-between items-center group transition-all duration-300 hover:shadow-md hover:shadow-blue-900/30 hover:translate-y-[-2px]"
                >
                  <span className="text-gray-200 font-medium">{todo.content}</span>
                  <button
                    onClick={(e) => deleteTodo(todo.id, e)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-3 text-sm text-gray-400 text-center border-t border-gray-700">
          <span className="flex items-center justify-center gap-1">
            <Zap size={14} className="text-blue-400" />
            You have {todos.length} power task{todos.length !== 1 ? 's' : ''} ready to conquer
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;