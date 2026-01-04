import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Bed, Users, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { Room, Bed as BedType, Page } from '../types';
import ThemeToggle from './ThemeToggle';

interface RoomManagementProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const RoomManagement: React.FC<RoomManagementProps> = ({ onNavigate, onLogout }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<BedType[]>([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'General' as Room['type'],
    floor: 1,
    capacity: 1
  });

  useEffect(() => {
    // Initialize with sample data
    const sampleRooms: Room[] = [
      { id: '1', roomNumber: '101', type: 'ICU', status: 'Occupied', patientId: 'ADM001', patientName: 'John Smith', floor: 1, capacity: 2, occupiedBeds: 1 },
      { id: '2', roomNumber: '102', type: 'General', status: 'Available', floor: 1, capacity: 2, occupiedBeds: 0 },
      { id: '3', roomNumber: '201', type: 'Private', status: 'Occupied', patientId: 'ADM002', patientName: 'Sarah Johnson', floor: 2, capacity: 1, occupiedBeds: 1 },
      { id: '4', roomNumber: '202', type: 'General', status: 'Available', floor: 2, capacity: 4, occupiedBeds: 0 },
      { id: '5', roomNumber: '301', type: 'Emergency', status: 'Maintenance', floor: 3, capacity: 1, occupiedBeds: 0 }
    ];

    const sampleBeds: BedType[] = [
      { id: '1', bedNumber: 'B1', roomId: '1', status: 'Occupied', patientId: 'ADM001', patientName: 'John Smith' },
      { id: '2', bedNumber: 'B2', roomId: '1', status: 'Available' }, // Second bed in ICU
      { id: '3', bedNumber: 'B1', roomId: '2', status: 'Available' },
      { id: '4', bedNumber: 'B2', roomId: '2', status: 'Available' },
      { id: '5', bedNumber: 'B1', roomId: '3', status: 'Occupied', patientId: 'ADM002', patientName: 'Sarah Johnson' },
      { id: '6', bedNumber: 'B1', roomId: '4', status: 'Available' },
      { id: '7', bedNumber: 'B2', roomId: '4', status: 'Available' },
      { id: '8', bedNumber: 'B3', roomId: '4', status: 'Available' },
      { id: '9', bedNumber: 'B4', roomId: '4', status: 'Available' },
      { id: '10', bedNumber: 'B1', roomId: '5', status: 'Available' }
    ];

    setRooms(sampleRooms);
    setBeds(sampleBeds);
  }, []);

  const handleAddRoom = () => {
    // Auto-generate room number if empty
    let roomNumber = newRoom.roomNumber;
    if (!roomNumber) {
      const existingNumbers = rooms
        .filter(r => r.floor === newRoom.floor)
        .map(r => parseInt(r.roomNumber))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);
      
      let nextNumber = newRoom.floor * 100 + 1; // Start from X01 for each floor
      while (existingNumbers.includes(nextNumber)) {
        nextNumber++;
      }
      roomNumber = nextNumber.toString();
    }

    const room: Room = {
      id: Date.now().toString(),
      roomNumber: roomNumber,
      type: newRoom.type,
      status: 'Available',
      floor: newRoom.floor,
      capacity: newRoom.capacity,
      occupiedBeds: 0
    };

    setRooms([...rooms, room]);
    
    // Create beds for the room
    const roomBeds: BedType[] = [];
    for (let i = 1; i <= newRoom.capacity; i++) {
      roomBeds.push({
        id: `${room.id}-${i}`,
        bedNumber: `B${i}`,
        roomId: room.id,
        status: 'Available'
      });
    }
    setBeds([...beds, ...roomBeds]);

    setNewRoom({ roomNumber: '', type: 'General', floor: 1, capacity: 1 });
    setShowAddRoom(false);
  };

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Occupied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Occupied':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'Maintenance':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    }
  };

  const getRoomTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'ICU':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'General':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Private':
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
      case 'Emergency':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    }
  };

  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate(Page.PatientList)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage hospital rooms and bed allocation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setShowAddRoom(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </button>
              <button
                onClick={onLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Bed className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rooms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rooms.filter(r => r.status === 'Available').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rooms.filter(r => r.status === 'Occupied').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Wrench className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rooms.filter(r => r.status === 'Maintenance').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms by Floor */}
        {Object.keys(roomsByFloor).sort().map(floor => (
          <div key={floor} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Floor {floor}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {roomsByFloor[parseInt(floor)].map(room => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Room {room.roomNumber}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.type)}`}>
                        {room.type}
                      </span>
                    </div>
                    {getStatusIcon(room.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                      <span className="text-gray-900 dark:text-white">{room.occupiedBeds}/{room.capacity}</span>
                    </div>
                    {room.patientName && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Patient:</span>
                        <span className="text-gray-900 dark:text-white ml-1">{room.patientName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={`Auto-generate (e.g., ${newRoom.floor}01)`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to auto-generate room number
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Type
                </label>
                <select
                  value={newRoom.type}
                  onChange={(e) => {
                    const type = e.target.value as Room['type'];
                    // Set default capacity based on room type
                    let defaultCapacity = 1;
                    if (type === 'ICU') defaultCapacity = 2;
                    else if (type === 'General') defaultCapacity = 4;
                    else if (type === 'Private') defaultCapacity = 1;
                    else if (type === 'Emergency') defaultCapacity = 1;
                    
                    setNewRoom({ ...newRoom, type, capacity: defaultCapacity });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="General">General (4 beds)</option>
                  <option value="ICU">ICU (2 beds)</option>
                  <option value="Private">Private (1 bed)</option>
                  <option value="Emergency">Emergency (1 bed)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  min="1"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bed Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRoom(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;