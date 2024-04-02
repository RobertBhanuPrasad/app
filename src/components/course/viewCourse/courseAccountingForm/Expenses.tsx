const Expenses = () => {
  return (
    <div>
        <div className="grid grid-cols-4 border rounded-[16px] w-[1302px] h-[44px] p-3">
            <h3 className="font-sans text-base font-bold leading-5 text-gray-700">Total Requested:</h3>
            <p className=" font-bold text-blue-600"> 60.00</p>
        
        </div><br/>
        <div >
            <h2 className="font-sans text-base font-semibold leading-6 text-left text-gray-700 pb-4">Expense Summary and Details</h2>
            <div className="pt-5  border w-[1303px] h-[332px] rounded-[10px]">
                <h3 className="font-sans text-[18px] font-semibold leading-7 text-gray-800 pl-[50px] pb-7"> Expense Summary</h3>
                <div className="grid grid-cols-2">
                <p className="pl-[50px] font-sans text-base font-normal leading-5 text-gray-700 pb-5">Expense category</p>
                <p className="font-sans text-base font-normal leading-5 text-gray-600">Amount (EUR)</p>
                 </div><hr></hr>
                 <div className="pt-5 pb-7 grid grid-cols-2 ">
                <p className=" pl-[50px] font-sans text-base font-normal leading-5 text-gray-700">Honoraium</p>
                <p  className="font-sans text-base font-normal leading-5 text-gray-600 " >60.00</p>
                 </div>
                 <div className="pb-5 grid grid-cols-2">
                <p className=" pl-[50px] font-sans text-base font-bold leading-5 text-gray-700">Total</p>
                <p className="font-sans text-base font-bold leading-5 text-gray-600 ">600.00 </p>
                 </div><hr />
                 <div className=" pt-5 grid grid-cols-2">
                <p className="pl-[50px] font-sans text-base font-normal leading-5 text-gray-700">Current Expense:</p>
                <p  className="font-sans text-base font-normal leading-5 text-gray-600">60.00 (10.00%) </p>
                 </div>
                 <div className="pt-5 grid grid-cols-2">
                <p className="pl-[50px] font-sans text-base font-normal leading-5 text-gray-700">Allowed Expense Limit</p>
                <p  className="font-sans text-base font-normal leading-5 text-green-600">600.00 </p>
                 </div>


            </div>
             
        </div><br/><br/>

        <div>
            <h2 className="font-sans text-base font-semibold leading-6  text-gray-700 pb-5 ">Expense Summary and Details</h2>
            <div className="border rounded-[16px] w-[1303px] h-[245px] ">
            <div className=" rounded-t-[16px] bg-indigo-50 pt-3 pb-5 grid grid-cols-3 font-sans text-sm font-semibold leading-5 text-gray-700">
    <h3 className="ml-5" >Username</h3>
    <h3 className="ml-3">Timestamp</h3>
    <h3 className="ml-[87px]">Action</h3>
</div>
<div className="ml-5 font-sans text-sm font-normal leading-5 text-gray-700  " >
    <div className="grid grid-cols-3 pt-3 pb-5  ">
    <p>Test Teacher (Nationladmin1@yopmail.com)</p>  
    <p>27 Jan 2024 00:01:05EST</p> 
    <p className="ml-20">Submitted</p>
    </div>
    <div className="grid grid-cols-3 pb-5">
    <p>Test Teacher (Nationladmin1@yopmail.com)</p>  
    <p>27 Jan 2024 00:01:05EST</p> 
    <p className="ml-20">Submitted</p>
     </div>
    <div className="grid grid-cols-3 pb-5">
    <p>Test Teacher (Nationladmin1@yopmail.com)</p>  
    <p>27 Jan 2024 00:01:05EST</p> 
    <p className="ml-20">Submitted</p>
    </div>
    <div className="grid grid-cols-3 ">
    <p>Test Teacher (Nationladmin1@yopmail.com)</p>  
    <p>27 Jan 2024 00:01:05EST</p> 
    <p className="ml-20">Submitted</p>
    </div>
</div>
            </div>



        </div><br/>
        <div>
            <p className="font-sans text-base font-normal leading-6 text-gray-700"> If you were unable to upload your receipts electronically, please send  the originals to accounting. If you were able to upload your receipts successfully, there is no need tosend the originals.Receipts can be sent to the following address</p>
        </div><br/>
        <div className="flex">
        <input type="checkbox" className="w-[24px] h-[24px] rounded-[8px] text-indigo-600 "/>
            <p className="pl-5 font-sans text-base font-normal leading-6 text-gray-700">I Certify that the above expenses were necessary in the performance of the course/project and the amount are correct to the best of my knowledge</p>
        </div><br/>
    </div>
  )
}

export default Expenses