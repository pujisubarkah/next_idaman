import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const SearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  const handleShowAll = () => {
    // Implement show all logic here
    setSearchTerm('');
  };

  const handleExport = () => {
    // Implement export to Excel logic here
    console.log('Exporting data to Excel');
  };

  return (
    <div className="col-lg-6">
      <div className="panel-group" id="accordion">
        <div className="panel panel-default">
          <div className="panel-heading">
            <a
              data-toggle="collapse"
              data-parent="#accordion"
              href="#collapseOne"
            >
              <h4 className="panel-title m-0">Search</h4>
            </a>
          </div>
          <div id="collapseOne" className="panel-collapse collapse show">
            <div className="panel-body">
              <div className="form-inline">
                <div className="form-group">
                  {/* Search Input */}
                  <input
                    className="form-control mb-2 mr-2"
                    id="psearch"
                    name="psearch"
                    placeholder="Search"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {/* Search Button */}
                  <button
                    className="btn btn-primary mb-2"
                    id="btnsubmit"
                    name="btnsubmit"
                    onClick={handleSearchSubmit}
                  >
                    Search
                  </button>
                  {/* Show All Button */}
                  <button
                    className="btn btn-default mb-2 ml-2"
                    onClick={handleShowAll}
                  >
                    Show all
                  </button>
                  {/* Export to Excel Button */}
                  <button
                    className="btn bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-2"
                    onClick={handleExport}
                    aria-label="Export data to Excel"
                  >
                    <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                    Export to Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
