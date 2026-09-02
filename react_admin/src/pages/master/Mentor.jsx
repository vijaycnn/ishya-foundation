import { Badge, Row, Col, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { BiPencil, BiTrash } from "react-icons/bi";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
import { decode as base64_decode, encode as base64_encode } from "base-64";

function Mentor() {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState({});
  const [search, setSearch] = useState({
    startDate: "",
    endDate: "",
    roleType: "",
  });
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const today = formatDate(new Date());

    setSearch((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "startDate") {
        // If startDate <= today → auto-set endDate to today
        if (value && value <= today) {
          updated.endDate = today;
        }
      }

      return updated;
    });
  };
  const searchData = () => {
    setFilteredData(search);
    setOffset(0);
    setCurrentPage(0);
  };

  const reset = () => {
    setSearch({
      startDate: "",
      endDate: "",
      roleType: "",
    });
    setFilteredData({});
    setOffset(0);
    setCurrentPage(0);
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    let offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffset(offset);
  };
  const getMentors = async () => {
    setIsLoading(true);

    const body = {
      params: { offset: offset, perPage: perPage, ...filteredData },
    };
    // console.log('body>>> ', body);
    await axiosInstance
      .get(`/mentor/list`, body)
      .then((response) => {
        // console.log('>>> ', response.data);
        setIsLoading(false);
        if (response.data.status === "success") {
          setPageCount(Math.ceil(response.data?.totalRecords / perPage));
          setItems(response.data?.data);
          setTotalRecords(response.data?.totalRecords);
        }
      })
      .catch((error) => {
        console.log(">>> ", error.status, error);
        if (error.status === 403) {
          // alert('Session Timeout');
          handleLogout();
        }
        setIsLoading(false);
      });
  };

  const changeStatus = async (index, currentStatus, mentorId) => {
    setIsLoading(true);

    const body = { mentorId, status: currentStatus == 1 ? 0 : 1 };
    // console.log('body>>> ', body);
    await axiosInstance
      .post(`/mentor/changeStatus`, body)
      .then((response) => {
        // console.log('>>> ', response.data);
        setIsLoading(false);
        if (response.data.status === "success") {
          items[index].status = currentStatus == 1 ? 0 : 1;
        }
      })
      .catch((error) => {
        console.log(">>> ", error.status, error);
        if (error.status === 403) {
          // alert('Session Timeout');
          handleLogout();
        }
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };

  useEffect(() => {
    if (!isLoading) {
      getMentors();
    }
  }, [offset, perPage, filteredData]);

  const showItems = () => {
    return isLoading == false ? (
      <>
        <Table responsive className="table v-align-middle table-striped medium">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Order. No.</th>
              <th>Mentor Image</th>
              <th>Name</th>
              <th>Expertise</th>
              {/* <th>Description</th> */}
              <th>Status</th>
              <th width="120" className="col-fixed">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-muted">
            {items.map((item, $index) => {
              return (
                <>
                  <tr key={item.id}>
                    <td>{item.orderNumber}</td>
                    <td>
                      <img
                        src={item.fileUrl}
                        height={60}
                        width={60}
                        alt="img"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.title}</td>
                    {/* <td>{item.remark1}</td> */}
                    {/* <td>{moment(item.createdAt).format('DD-MM-YYYY')}</td> */}
                    <td>
                      {item.status == 1 ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">In-active</Badge>
                      )}
                    </td>
                    <td className="col-fixed">
                      <Link
                        title="Edit"
                        to={`${adminAlias}/editMentor/${base64_encode(
                          `Hvg_myg8Bbg5vvdgvpp+` + item.id
                        )}`}
                        className="btn btn-icon"
                      >
                        <BiPencil />
                      </Link>
                      &nbsp;
                      <Link
                        title={item.status == 1 ? "In-Active" : "Active"}
                        onClick={() =>
                          changeStatus($index, item.status, item.id)
                        }
                        className="btn btn-icon"
                      >
                        <BiTrash />
                      </Link>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </>
    ) : (
      <LoadingSpinner />
    );
  };
  return (
    <>
      <h1 className="h4 mb-4 font-secondary fw-medium">Mentors</h1>

      <div className="table-view bg-white rounded-4 p-4">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Total Records :{" "}
            <span className="text-dark fw-bold">
              {totalRecords ? totalRecords : 0}
            </span>
          </div>
          <div>
            <Link
              to={`${adminAlias}/addMentor`}
              className="btn btn-primary btn-sm"
            >
              <span className="nav-link-text">Add Mentor</span>
            </Link>
          </div>
        </div>
        {items && items.length > 0 ? (
          showItems()
        ) : (
          <>
            <div className="d-flex text-muted justify-content-center p-5 w-100 align-items-center flex-column">
              <i className="fa fa-database fa-3x mb-3"></i>
              <p>Sorry, no record found!</p>
            </div>
          </>
        )}
      </div>
      {items ? (
        items.length > 0 ? (
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={
              "pagination justify-content-center flex-wrap mt-3"
            }
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        ) : null
      ) : null}
    </>
  );
}

export default Mentor;
