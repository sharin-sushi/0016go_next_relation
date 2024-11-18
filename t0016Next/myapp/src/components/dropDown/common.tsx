// https://zenn.dev/morit4ryo/articles/1897b2296b8f1c
export const DropStyle = {
  control: (provided: any, state: any) => ({
    ...provided,
    width: "100%",
    borderRadius: "none",
    border: "1px solid gray",
    backgroundColor: "#eee",
    fontSize: "16px",
    option: "14px",
    textAlign: "left",
    "&:hover": {
      border: "2px solid #FFF6E4",
      cursor: "pointer",
    },
  }),
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#657261" : "#eee",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "#888",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#eee",
  }),
};
