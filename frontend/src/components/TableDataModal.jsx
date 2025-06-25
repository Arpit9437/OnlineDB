const TableDataModal = ({ isOpen, onClose, tableName, data, schema }) => {
  if (!isOpen) return null

  const isSchemaView = !!schema
  const hasData = data && data.length > 0

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isSchemaView 
                ? 'bg-emerald-500' 
                : 'bg-blue-500'
            }`}>
              {isSchemaView ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {tableName}
              </h2>
              <div className="flex items-center space-x-2">
                {!isSchemaView && hasData && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {data.length} row{data.length !== 1 ? 's' : ''}
                  </span>
                )}
                {isSchemaView && schema && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {schema.length} column{schema.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
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
        <div className="overflow-auto max-h-[calc(90vh-120px)] bg-slate-50/50 dark:bg-slate-900/20">
          {isSchemaView && schema ? (
            <div className="p-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          Column Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          Data Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          Properties
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {schema.map((column, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {column.column_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                              {column.data_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {column.column_key === 'PRI' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  PRIMARY KEY
                                </span>
                              ) : (
                                <>
                                  {column.is_nullable === 'NO' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                      NOT NULL
                                    </span>
                                  )}
                                  {column.is_unique === 'UNI' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                      UNIQUE
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : hasData ? (
            <div className="p-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                        {Object.keys(data[0]).map((key, index) => (
                          <th key={key} className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>{key}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4">
                              <div className="text-sm text-slate-900 dark:text-slate-100">
                                {value === null ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    NULL
                                  </span>
                                ) : value === "" ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    EMPTY
                                  </span>
                                ) : (
                                  <span className="font-mono text-sm">
                                    {value?.toString() || ""}
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
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No Data Available
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                This table doesn't contain any data yet. Start adding records to see them here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            {isSchemaView && schema && (
              <span>{schema.length} columns defined</span>
            )}
            {!isSchemaView && hasData && (
              <>
                <span>{data.length} rows</span>
                <span>•</span>
                <span>{Object.keys(data[0]).length} columns</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableDataModal