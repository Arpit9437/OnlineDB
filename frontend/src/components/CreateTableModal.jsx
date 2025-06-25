import { useState } from "react"

const CreateTableModal = ({ isOpen, onClose, onCreateTable }) => {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState([{ name: "", type: "TEXT", constraints: [] }])
  const [loading, setLoading] = useState(false)

  const dataTypes = ["TEXT", "INTEGER", "BOOLEAN", "DATE", "TIMESTAMP", "DECIMAL", "VARCHAR(255)"]

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "TEXT", constraints: [] }])
  }

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const updateColumn = (index, field, value) => {
    const newColumns = [...columns]
    newColumns[index][field] = value
    setColumns(newColumns)
  }

  const toggleConstraint = (columnIndex, constraint) => {
    const newColumns = [...columns]
    const column = newColumns[columnIndex]
    
    if (constraint === 'PRIMARY KEY') {
      // If PRIMARY KEY is selected, remove other constraints and set only PRIMARY KEY
      if (column.constraints.includes('PRIMARY KEY')) {
        column.constraints = column.constraints.filter(c => c !== 'PRIMARY KEY')
      } else {
        column.constraints = ['PRIMARY KEY']
      }
    } else {
      // For NOT NULL and UNIQUE
      if (column.constraints.includes('PRIMARY KEY')) {
        // If PRIMARY KEY is already selected, don't allow other constraints
        return
      }
      
      if (column.constraints.includes(constraint)) {
        column.constraints = column.constraints.filter(c => c !== constraint)
      } else {
        column.constraints = [...column.constraints, constraint]
      }
    }
    
    setColumns(newColumns)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tableName.trim() || columns.some((col) => !col.name.trim())) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await onCreateTable(tableName, columns)
      setTableName("")
      setColumns([{ name: "", type: "TEXT", constraints: [] }])
      onClose()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create New Table</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Define your table structure and columns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="space-y-6">
            {/* Table Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Table Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-slate-100 placeholder-slate-400 transition-all"
                  placeholder="Enter table name (e.g., users, products)"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Columns */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Columns
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  {columns.length} column{columns.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                {columns.map((column, index) => (
                  <div key={index} className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 group">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={column.name}
                          onChange={(e) => updateColumn(index, "name", e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-slate-100 placeholder-slate-400 text-sm transition-all"
                          placeholder={`Column ${index + 1} name`}
                          required
                        />
                      </div>
                      <div className="w-40">
                        <select
                          value={column.type}
                          onChange={(e) => updateColumn(index, "type", e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-slate-100 text-sm transition-all"
                        >
                          {dataTypes.map((type) => (
                            <option key={type} value={type} className="dark:bg-slate-900">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColumn(index)}
                          className="w-9 h-9 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg hover:text-red-700 dark:hover:text-red-300 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          title="Remove column"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Constraints */}
                    <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                        Constraints (optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['NOT NULL', 'UNIQUE', 'PRIMARY KEY'].map((constraint) => {
                          const isSelected = column.constraints.includes(constraint)
                          const isPrimaryKeySelected = column.constraints.includes('PRIMARY KEY')
                          const isDisabled = isPrimaryKeySelected && constraint !== 'PRIMARY KEY'
                          
                          return (
                            <button
                              key={constraint}
                              type="button"
                              onClick={() => toggleConstraint(index, constraint)}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                isSelected
                                  ? constraint === 'PRIMARY KEY'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200'
                                    : constraint === 'UNIQUE'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200'
                                    : 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                                  : isDisabled
                                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                              }`}
                            >
                              {constraint}
                            </button>
                          )
                        })}
                      </div>
                      {column.constraints.includes('PRIMARY KEY') && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Primary key automatically includes NOT NULL and UNIQUE
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addColumn} 
                  className="w-full py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Column</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !tableName.trim() || columns.some(col => !col.name.trim())}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Table</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateTableModal