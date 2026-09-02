import {
  Container,
  Form,
  Badge,
  Row,
  Col,
  Button,
  Table, Modal
} from "react-bootstrap";
// import { BiPencil } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BiShow } from "react-icons/bi";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDownloadUrl, cityList } from "../api";
import moment from "moment";
import axiosInstance from "../helper/constants/axiosInstance";
const adminAlias = import.meta.env.VITE_API_ADMIN_ALIAS;
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Participate() {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const S3_baseurl = import.meta.env.VITE_API_S3FILE_URL;
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

  const roleList = [
    "Composer",
    "Lyricist",
    "Music Producer",
    "Singer",
    "Songwriter",
    "Others",
  ];
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    let offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffset(offset);
  };
  const getEnquiryList = async () => {
    setIsLoading(true);

    const body = {
      params: { offset: offset, perPage: perPage, ...filteredData },
    };
    console.log("body>>> ", body);
    await axiosInstance
      .get(`/enquiry`, body)
      .then((response) => {
        console.log(">>> ", response.data);
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
        // showAlert("Can not get Leads.", "danger")
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.clear("auth-token");
    localStorage.clear();
    navigate(adminAlias);
  };

  const getMediaFile = async (fileUrl) => {
    if (fileUrl != "") {
      setIsLoading(true); setPreviewMedia(null);
      const key = fileUrl.split(".amazonaws.com/")[1];
      // console.log("key :: ", key);
      if(key){
      let result = await getDownloadUrl(key);
      if(result){
        // console.log(">>> ", result);
        const { downloadUrl } = result;
      
        // window.open(downloadUrl, "_blank");        
        setPreviewMedia({filePath: downloadUrl});
      }}
      setIsLoading(false);
      setShowPreview(true);      
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getEnquiryList();
    }
  }, [offset, perPage, filteredData]);

  const handleExportExcel = async () => {
    setIsLoading(true);
    try {
      const body = { params: { offset: 0, perPage: 0, ...filteredData } };
      console.log("body>>> ", body);
      const res = await axiosInstance.get(`/enquiry`, body);
      if (res.data?.data?.length === 0) {
        alert("No data found to export!");
        setIsLoading(false);
        return;
      }

      const exportData = res.data.data.map((item, index) => ({
        "S.No": index + 1,
        "Participate ID": item.id
          ? "HMA" + String(item.id).padStart(5, "0")
          : "",
        "Submission Date": item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
        Name: item.name || "",
        Phone: item.contact || "",
        Email: item.email || "",
        DOB: item.dob ? new Date(item.dob).toLocaleDateString() : "",
        "Role Interested": item.interest_in_role || "",
        "Other Role": item.other_roles || "",
        Dream: item.dream_remarks || "",
        "How to know about this": item.how_to_know_about_this || "",
        Story: item.story || "",
        State: item?.StateMaster?.stateName || "",
        City: item?.CityMaster?.cityName || "",
        Address: item.address || "",
        Pincode: item.pincode || "",
        "Media File URL": item.media_url || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiry Data");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(
        fileData,
        `Participant_List_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Export Error:", error);
    }
    setIsLoading(false);
  };

  const [showPreview, setShowPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const showItems = () => {
    return isLoading == false ? (
      <>
        <Table responsive className="table v-align-middle table-striped medium">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name / DOB</th>
              <th>Submission Date</th>
              <th>Contact / Email</th>
              <th>Role Interested</th>
              {/* <th>Dream</th> */}
              {/* <th>How to know about this</th> */}
              {/* <th>State</th> */}
              <th>City</th>
              <th>Action</th>
              {/* <th width="120" className="col-fixed">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody className="text-muted">
            {items.map((item, $index) => {
              // let fileUrl =   item.media_url;
              // if(!item.media_url.contains('http')){
              let fileUrl = item.media_url;
              // }
              return (
                <>
                  <tr key={item.id}>
                    <td>HMA{String(item.id).padStart(5, "0")}</td>
                    <td>
                      {item.name}
                      <br />
                      {item.dob ? moment(item.dob).format("DD-MM-YYYY") : "NA"}
                    </td>
                    <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                    <td>
                      {item.contact} <br />
                      {item.email}
                    </td>
                    <td>
                      {item.interest_in_role} <br />{" "}
                      {item.other_roles ? item.other_roles : ""}{" "}
                    </td>
                    {/* <td>{item.dream_remarks}</td> */}
                    {/* <td>{item.how_to_know_about_this}</td> */}
                    {/* <td>
                      {item?.StateMaster?.stateName
                        ? item?.StateMaster?.stateName
                        : "NA"}
                    </td> */}
                    <td>
                      {item?.CityMaster?.cityName
                        ? item?.CityMaster?.cityName
                        : "NA"}
                    </td>
                    <td>
                      {item.media_url ? (
                        <>
                          {/* <button >View File</button> */}
                          <a title="View File" onClick={() => getMediaFile(item.media_url)}
                            className="btn btn-icon" >
                            <BiShow />
                          </a>
                        </>
                      ) : (
                        "NA"
                      )}
                    </td>
                    {/* <td className="col-fixed">
                      <Button variant="default btn-icon">
                        <BiPencil />
                      </Button>
                    </td> */}
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
      <h1 className="h4 mb-4 font-secondary fw-medium">Participant</h1>
      <div className="bg-white p-4 rounded mb-4">
        <h6 className="font-secondary text-muted fw-medium mb-4">Filters</h6>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <Form.Select
                name="roleType"
                value={search.roleType}
                onChange={handleFilterChange}
              >
                <option key="" value="">
                  Select All
                </option>
                {roleList.map((role, $index) => (
                  <option key={$index + 1} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Duration - Start Date</Form.Label>
              <Form.Control
                type="date"
                value={search.startDate}
                onChange={handleFilterChange}
                name="startDate"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Duration - End Date</Form.Label>
              <Form.Control
                type="date"
                value={search.endDate}
                onChange={handleFilterChange}
                mindate={search.startDate}
                name="endDate"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="primary" size="sm" onClick={searchData}>
            <span>Search</span>
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={!items || items.length == 0}
            onClick={handleExportExcel}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="table-view bg-white rounded-4 p-4">
        <div className="text-muted mb-3">
          Total Records :{" "}
          <span className="text-dark fw-bold">
            {totalRecords ? totalRecords : 0}
          </span>
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

      <Modal id="preview" name="preview" show={showPreview} onHide={() => setShowPreview(false)} centered size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>{previewMedia?.title || "Preview"}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <video src={previewMedia?.filePath} controls autoPlay style={{ width: "100%", borderRadius: "8px" }} />
        </Modal.Body>
      </Modal>
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

export default Participate;
