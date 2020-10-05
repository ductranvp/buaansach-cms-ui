const StoreUserStatus = {
  valueArray: ["WORKING", "QUIT", "FIRED"],
  labelArray: ["Đang làm việc", "Đã nghỉ việc", "Đã sa thải"],
  value: {WORKING: "WORKING", QUIT: "QUIT", FIRED: "FIRED"},
  label: {WORKING: "Đang làm việc", QUIT: "Đã nghỉ việc", FIRED: "Đã sa thải"},
  optionArray: [
    {value: "WORKING", label: "Đang làm việc"},
    {value: "QUIT", label: "Đã nghỉ việc"},
    {value: "FIRED", label: "Đã sa thải"}
  ],
};
export default StoreUserStatus;
