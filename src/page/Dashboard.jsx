import React, { useEffect, useState } from "react";
import { fetchApi } from "../services/ApiService";

function Dashboard() {
  const [userPackagae, setUserPackage] = useState([]);
  const getUserPackage = async () => {
    const response = await fetchApi.getApi("/apps_user")
    // if(response.error){
      
    // };
    // console.log(response)
    setUserPackage(response.data);
  }

  useEffect(() => {
    getUserPackage()
  }, [])
  return (
    <div className="w-full bg-red-500  px-5 grid  grid-cols-6 gap-x-10">
      <div className="rounded bg-blue-500 min-h-10">Manajemen proker</div>
      {userPackagae.map((value, index) => (<div className="rounded bg-blue-500 min-h-10 bg-yellow-500">ini adlah index {value.application_name}</div>))}
    </div>
  );
}

export default Dashboard;
