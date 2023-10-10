import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ModalAddNew from "./ModalAddNew";
import ReactPaginate from "react-paginate";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import "./TableUser.scss";
import _, { debounce } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDelete] = useState({});
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  const [sortBy, setSortBy] = useState("asc"); // mặc định sắp xếp tăng dần
  const [sortField, setSortField] = useState("id");

  const [keyword, setKeyWord] = useState("");
  const [dataExport, setDataExport] = useState([]);
  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUserFormModal = (user) => {
    let updatedUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    if (index != -1) {
      updatedUsers[index].first_name = user.first_name;
      setListUsers(updatedUsers);
    }
  };
  useEffect(() => {
    // call apis
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
      setListUsers(res.data);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModal = (user) => {
    let updatedUsers = _.cloneDeep(listUsers);

    updatedUsers = updatedUsers.filter((item) => item.id !== user.id);
    setListUsers(updatedUsers);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let updatedUsers = _.cloneDeep(listUsers);
    updatedUsers = _.orderBy(updatedUsers, [sortField], [sortBy]); // dùng lodash
    setListUsers(updatedUsers);
    // updatedUsers = updatedUsers.sort((a, b) => b[sortField] - a[sortField]);   // cách sort của js
  };

  const handleSearch = debounce((e) => {
    let term = e.target.value;

    if (term) {
      // nếu như có
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(term)
      );
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 500);

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["id", "Email", "First name", "Last name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];

      if (file.type !== "text/csv") {
        toast.error("Only accept csv files...");
        return;
      }

      // parse local csv files
      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format header CSV file!");
              } else {
                let result = [];

                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
                console.log(">>>>>>", result);
              }
            } else {
              toast.error("Wrong format CSV file!");
            }
          } else {
            toast.error("not found data on CSV!");
          }
          console.log("Finished:", results.data);
        },
      });
    }
  };
  return (
    <>
      <div className="my-3 d-sm-flex add-new">
        <span>
          <b>List users:</b>
        </span>
        <div className="group-btns mt-sm-0 mt-2">
          <label htmlFor="test" className="btn btn-warning ">
            <i className="fa-solid fa-file-import"></i> Import
          </label>
          <input
            type="file"
            id="test"
            hidden
            onChange={(event) => handleImportCSV(event)}
          ></input>
          <CSVLink // export data user
            data={dataExport}
            filename={"user.csv"}
            className="btn btn-primary"
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i className="fa-solid fa-file-arrow-down mx-1"></i>
            Export
          </CSVLink>
          <button
            className="btn btn-success "
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus mx-1"></i>
            Add new
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email...."
          // value={keyword}
          onChange={(e) => handleSearch(e)}
        ></input>
      </div>
      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Email</th>
              <th>
                <div className="sort-header">
                  <span>First Name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down-long"
                      onClick={() => handleSort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up-long"
                      onClick={() => handleSort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        className="d-flex justify-content-center align-items-center list-unstyled"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFormModal={handleEditUserFormModal}
      />
      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  );
};
export default TableUsers;
