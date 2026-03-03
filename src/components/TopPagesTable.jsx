import React from 'react';

const TopPagesTable = () => {
  return (
    <div className="section">
      <h2 className="section-title">Top Sarkari Result Pages</h2>
      <table className="info-table">
        <tbody>
          <tr>
            <td><a href="/search?q=Bharat%20Result">Bharat Result</a></td>
            <td><a href="/search?q=Up%20Police%20Result">Up Police Result</a></td>
            <td><a href="/search?q=Bihar%20Police%20Result">Bihar Police Result</a></td>
          </tr>
          <tr>
            <td>Sarkari Exam</td>
            <td>SarkariResult Hindi</td>
            <td>Sarkari Result Ntpc</td>
          </tr>
          <tr>
            <td><a href="/search?q=Sarkari%20Result%202025">Sarkari Result 2025</a></td>
            <td><a href="/search?q=Sarkari%20result">Sarkari result</a></td>
            <td>Sarkari</td>
          </tr>
          <tr>
            <td>Sarkari Naukri</td>
            <td>Sarkari Result 10th</td>
            <td>Sarkari Result Center</td>
          </tr>
          <tr>
            <td>Sarkari Result 10+2</td>
            <td><a href="/search?q=Sarkariresult">Sarkariresult</a></td>
            <td>Sarkari Result SSC</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TopPagesTable; 