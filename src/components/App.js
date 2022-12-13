import { useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import styles from "./App.module.css";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/files/data",
    fetcher
  );

  const rows = useMemo(() => {
    if (isLoading || error) return [];
    return data.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.lines.map((line) => ({ file: cur.file, ...line })),
      ],
      []
    );
  }, [data, error, isLoading]);

  return (
    <div className="container-xl min-vh-100 mx-auto d-flex flex-column gap-3 align-items-center">
      <header className="w-100 py-3 bg-danger bg-opacity-75 border border-danger">
        <h1 className="m-0 fs-3 fw-bold text-white">
          Toolboox Technical Assessment
        </h1>
      </header>
      <main className="w-100 d-flex px-xl-5 flex-column flex-fill">
        {isLoading ? (
          <div className="w-100 d-flex flex-fill justify-content-center align-items-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <h2 className="m-0 text-center">
            Something went wrong :(
            <br />
            Try again later
          </h2>
        ) : (
          <Table responsive="lg" bordered striped>
            <thead className={styles.tableHead}>
              <tr>
                <th>File Name</th>
                <th>Text</th>
                <th>Number</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.hex + row.number}>
                    <td>{row.file}</td>
                    <td>{row.text}</td>
                    <td>{row.number}</td>
                    <td>{row.hex}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>It looks like it's empty</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </main>
    </div>
  );
}

export default App;
