"use client";

import { useState, useEffect } from "react";
import { Associate, Supervisor, UserRole } from "@/types";

interface EditingUser {
  id: string;
  field: string;
  value: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<(Associate | Supervisor)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(Associate | Supervisor)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | UserRole>("ALL");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [currentUser, setCurrentUser] = useState<Associate | Supervisor | null>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'SUPERVISOR') {
        window.location.href = '/dashboard';
        return;
      }
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role === 'ASSOCIATE' && (user as Associate).cnpj.includes(searchTerm))
      );
    }

    if (filterRole !== "ALL") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error('Erro ao carregar usuários:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    try {
            if (!date) return 'Data não informada';
            
            const dateObj = date instanceof Date ? date : new Date(date);
            
            if (isNaN(dateObj.getTime())) {
                return 'Data inválida';
            }
            
            return dateObj.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

  const handleEdit = (userId: string, field: string, currentValue: string) => {
    setEditingUser({ id: userId, field, value: currentValue });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const updateData: any = {};
      
      if (editingUser.field === 'role') {
        updateData.role = editingUser.value as UserRole;
      } else if (editingUser.field === 'isActive') {
        updateData.isActive = editingUser.value === 'true';
      } else {
        updateData[editingUser.field] = editingUser.value;
      }

      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingUser.id,
          ...updateData
        }),
      });

      if (response.ok) {
        setEditingUser(null);
        await loadUsers(); 
      } else {
        const data = await response.json();
        alert('Erro ao atualizar usuário: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await loadUsers(); // Recarregar dados
        alert('Usuário excluído com sucesso!');
      } else {
        const data = await response.json();
        alert('Erro ao excluir usuário: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário');
    }
  };

  const renderEditableField = (userId: string, field: string, value: string | boolean, type: 'text' | 'select' | 'boolean' = 'text') => {
    const isEditing = editingUser?.id === userId && editingUser?.field === field;

    if (isEditing) {
      if (type === 'select' && field === 'role') {
        return (
          <div className="flex items-center space-x-2">
            <select
              value={editingUser.value}
              onChange={(e) => setEditingUser({...editingUser, value: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ASSOCIATE">Associado</option>
              <option value="SUPERVISOR">Admin</option>
            </select>
            <button
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-800 text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              ✕
            </button>
          </div>
        );
      } else if (type === 'boolean') {
        return (
          <div className="flex items-center space-x-2">
            <select
              value={editingUser.value}
              onChange={(e) => setEditingUser({...editingUser, value: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <button
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-800 text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              ✕
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editingUser.value}
              onChange={(e) => setEditingUser({...editingUser, value: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-800 text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              ✕
            </button>
          </div>
        );
      }
    }

    let displayValue = String(value);
    let statusClass = "";

    if (field === 'role') {
      displayValue = value === 'SUPERVISOR' ? 'Admin' : 'Associado';
      statusClass = value === 'SUPERVISOR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    } else if (field === 'isActive') {
      displayValue = value ? 'Ativo' : 'Inativo';
      statusClass = value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    }

    return (
      <div className="flex items-center justify-between group">
        <span className={`text-xs px-2 py-1 rounded ${statusClass || ''}`}>
          {displayValue}
        </span>
        <button
          onClick={() => handleEdit(userId, field, String(value))}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all text-xs"
          title="Clique para editar"
        >
          ✏️
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gerenciar Usuários
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie todos os usuários do sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Usuários</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Associados</h3>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.role === 'ASSOCIATE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Administradores</h3>
          <p className="text-3xl font-bold text-red-600">
            {users.filter(u => u.role === 'SUPERVISOR').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ativos</h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'ASSOCIATE' ? (u as Associate).isActive : true).length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesquisar
            </label>
            <input
              type="text"
              placeholder="Buscar por nome, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as "ALL" | UserRole)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos</option>
              <option value="ASSOCIATE">Associados</option>
              <option value="SUPERVISOR">Administradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Informações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {renderEditableField(user.id, 'name', user.name)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {renderEditableField(user.id, 'email', user.email)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderEditableField(user.id, 'role', user.role, 'select')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'ASSOCIATE' ? 
                      renderEditableField(user.id, 'isActive', (user as Associate).isActive, 'boolean') :
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Ativo</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === 'ASSOCIATE' ? (
                      <div>
                        <div>CNPJ: {(user as Associate).cnpj}</div>
                        <div>Tel: {(user as Associate).phone}</div>
                        <div>{(user as Associate).city}/{(user as Associate).state}</div>
                      </div>
                    ) : (
                      <div>
                        <div>Permissões: {(user as Supervisor).permissions.length}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={user.id === currentUser?.id}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      title={user.id === currentUser?.id ? "Não é possível excluir seu próprio usuário" : "Excluir usuário"}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-lg">Nenhum usuário encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Total de {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} 
          {searchTerm && ` encontrado${filteredUsers.length !== 1 ? 's' : ''} para "${searchTerm}"`}
        </p>
      </div>
    </div>
  );
}