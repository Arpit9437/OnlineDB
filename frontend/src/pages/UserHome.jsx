import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dbApi } from '../utils/api'
import CreateTableModal from '../components/CreateTableModal'
import TableDataModal from '../components/TableDataModal'
import Editor from '@monaco-editor/react'

const UserHome = () => {
  const { user } = useAuth()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM ')
  const [queryResult, setQueryResult] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [error, setError] = useState('')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDataModal, setShowDataModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalTableName, setModalTableName] = useState('')
  const [modalSchema, setModalSchema] = useState(null)

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await dbApi.listTables(user.token)
      setTables(response.tables)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) fetchTables()
  }, [user])

  const handleCreateTable = async (tableName, columns) => {
    await dbApi.createTable(user.token, tableName, columns)
    await fetchTables()
  }

  const handleDeleteTable = async (tableName) => {
    if (window.confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      try {
        await dbApi.deleteTable(user.token, tableName)
        await fetchTables()
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const handleViewSchema = async (tableName) => {
    try {
      const response = await dbApi.getTableSchema(user.token, tableName)
      setModalTableName(tableName)
      setModalSchema(response.schema)
      setModalData(null)
      setShowDataModal(true)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleViewData = async (tableName) => {
    try {
      const response = await dbApi.getTableData(user.token, tableName)
      setModalTableName(tableName)
      setModalData(response.rows)
      setModalSchema(null)
      setShowDataModal(true)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return alert('Please enter a SQL query')
    setQueryLoading(true)
    setError('')
    try {
      const response = await dbApi.runQuery(user.token, sqlQuery)
      setQueryResult(response.rows)
      await fetchTables()
    } catch (error) {
      setError(error.message)
      setQueryResult(null)
    } finally {
      setQueryLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-full mx-auto p-6">
        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8 h-[calc(100vh-48px)]"> {/* Changed height */}
          {/* Left - Tables List */}
          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full flex-1"> {/* Added h-full flex-1 */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tables</h2>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Table</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center flex-1">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Loading tables...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                {tables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No tables found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first table to get started</p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
                    >
                      Create Table
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tables.map((tableName) => (
                      <div key={tableName} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{tableName}</h3>
                          </div>
                          <button 
                            onClick={() => handleDeleteTable(tableName)} 
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete Table
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => handleViewSchema(tableName)} 
                            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-600 transition-all"
                          >
                            View Schema
                          </button>
                          <button 
                            onClick={() => handleViewData(tableName)} 
                            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-600 transition-all"
                          >
                            View Data
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - SQL Editor */}
          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden h-full flex-1"> {/* Added h-full flex-1 */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PostgreSQL Editor</h2>
              </div>
              <button 
                onClick={handleRunQuery} 
                disabled={queryLoading} 
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:cursor-not-wait shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                {queryLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    
                    <span>Execute</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Editor */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-900">
              <Editor
                height="220px"
                defaultLanguage="sql"
                defaultValue={sqlQuery}
                value={sqlQuery}
                onChange={(value) => setSqlQuery(value)}
                theme="vs-dark"
                options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Query Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            {/* Results */}
            <div className="flex-1 flex flex-col min-h-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Query Results</h3>
                {queryResult && queryResult.length > 0 && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {queryResult.length} row{queryResult.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {queryResult ? (
                  queryResult.length ? (
                    <div className="overflow-auto h-full">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                            {Object.keys(queryResult[0]).map((key) => (
                              <th key={key} className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                  <span>{key}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {queryResult.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              {Object.values(row).map((val, idx) => (
                                <td key={idx} className="px-6 py-4">
                                  <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {val === null ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        NULL
                                      </span>
                                    ) : val === "" ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        EMPTY
                                      </span>
                                    ) : (
                                      <span className="font-mono text-sm">
                                        {val?.toString() || ""}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Query executed successfully</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">No results returned</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Run a query to see results here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTableModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreateTable={handleCreateTable} />
      <TableDataModal isOpen={showDataModal} onClose={() => setShowDataModal(false)} tableName={modalTableName} data={modalData} schema={modalSchema} />
    </div>
  )
}

export default UserHome