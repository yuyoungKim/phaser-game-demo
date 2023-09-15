// Leaderboard.js

import React from 'react';
import { Table } from 'react-bootstrap';

const Leaderboard = ({ data }) => {
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.score}</td>
            <td>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Leaderboard;
