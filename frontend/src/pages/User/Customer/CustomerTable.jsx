import { useState, useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Upload } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "https://invoich-backend.onrender.com/api/customer/viewCustomers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Log the full response to inspect

        // Correctly map the data and filter by userId
        const filteredData = data
          .filter((customer) => customer.userId === userId) // Filter customers by userId
          .map((customer) => ({
            id: customer._id,
            name: customer.displayName,
            companyname: customer.companyName,
            email: customer.email,
            workphone: customer.phoneNumber,
            receivables: customer.otherDetails?.[0]?.paymentTerms || "N/A",
            unusedcredits: customer.otherDetails?.[0]?.remarks || "N/A",
          }));

        console.log("Filtered Data:", filteredData); // Ensure the filtered data is correct
        setCustomers(filteredData); // Set the filtered data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [userId, file]); // Dependency on userId to refetch data if userId changes

  const deleteCustomer = async (id) => {
    // SweetAlert confirmation before deleting
    Swal.fire({
      title: "Are you sure?",
      text: "This customer will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#438A7A",
      cancelButtonColor: "#D1D5DB",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        cancelButton: 'custom-cancel'
      },
      didOpen: () => {
        document.querySelector('.custom-cancel').style.color = "black"; // Replace with your desired text color
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://invoich-backend.onrender.com/api/customer/deleteCustomer?id=${id}`,
            {
              method: "DELETE",
              headers: {                 
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete customer");
          }

          const result = await response.json();
          console.log("Delete Response:", result);

          // Update the UI after successful deletion
          const updatedCustomers = customers.filter(
            (customer) => customer.id !== id
          );
          setCustomers(updatedCustomers);

          Swal.fire(
            "Deleted!",
            result.message || "Customer deleted successfully",
            "success"
          );
        } catch (error) {
          console.error("Error deleting customer:", error.message);
          Swal.fire(
            "Error",
            "Failed to delete customer. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const viewCustomer = async (_id) => {
    try {
      const response = await fetch(
        `https://invoich-backend.onrender.com/api/customer/viewCustomers/${_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }
      const customer = await response.json();
      setSelectedCustomer(customer);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    return (
      customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.companyname.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      customer.workphone.includes(lowerCaseSearchTerm)
    );
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Upload CSV file
  const uploadCSV = async () => {
    if (!file) {
      Swal.fire("Please upload a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://invoich-backend.onrender.com/api/customer/Customercsv",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire("Success!", "CSV file uploaded successfully", "success");
        setFile(null);
      } else {
        Swal.fire("Error!", "Failed to upload CSV file", "error");
      }
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      Swal.fire("Error!", "An error occurred during upload", "error");
    }
  };

  const goToCustomerForm = () => {
    navigate("/user/customers/customer-form");
  };

  const editCustomer = (id) => {
    navigate(`/user/customers/customer-form/${id}`);
  };

  return (
    <div className="bg-[#F6F8FB] p-3">
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex justify-between p-2 pb-5">
          <h3 className="font-bold text-[26px]">All Customers</h3>
          <button
            className="flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2"
            onClick={() => navigate("/user/customers/customer-form")}
          >
            <MdAdd className="text-white text-xl mr-2" />
            New
          </button>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Company Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">
                      <Skeleton />
                    </td>
                    <td className="p-3">
                      <Skeleton />
                    </td>
                    <td className="p-3">
                      <Skeleton />
                    </td>
                    <td className="p-3">
                      <Skeleton />
                    </td>
                    <td className="p-3 text-center">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-t ">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.companyname}</td>
                    <td className="p-3">{customer.email}</td>
                    <td className="p-3">{customer.workphone}</td>
                    <td className="p-3 flex items-center justify-center gap-2">
                      
                      <button>
                        <FaEdit
                          className="text-green-500 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/user/customers/customer-form/${customer.id}`
                            )
                          }
                        />
                      </button>
                      <button>
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          onClick={() =>
                            navigate(`/user/customers/view/${customer.id}`)
                          }
                        />
                      </button>
                      <button>
                        <MdDelete
                          className="text-red-500 cursor-pointer"
                          onClick={() => alert("Delete function here")}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
