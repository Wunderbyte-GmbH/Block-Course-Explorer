const _getPaginationArray = ({ currentPage, totalPage }) => {
  if (totalPage > 5) {
    if (currentPage > 3 && currentPage <= totalPage - 2) {
      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    } else {
      if (currentPage < 3) {
        return [1, 2, 3, 4, 5];
      }
      if (currentPage > totalPage - 2) {
        return [
          totalPage - 4,
          totalPage - 3,
          totalPage - 2,
          totalPage - 1,
          totalPage,
        ];
      }
    }
  }

  return [1, 2, 3, 4, 5].slice(0, totalPage);
};
export const createPagination = ({
  container,
  id,
  total,
  perPage,
  currentPage,
  onChange,
}) => {
  if (container.querySelector(`#${id}`)) {
    container.querySelector(`#${id}`).remove();
  }
  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  pagination.id = id;
  const paginationNumbers = document.createElement("div");
  paginationNumbers.classList.add("pagination__numbers");
  paginationNumbers.style.display = "flex";
  paginationNumbers.style.alignContent = "center";
  paginationNumbers.style.gap = "4px";
  const totalPage = Math.ceil(total / perPage);
  let paginatorArray = _getPaginationArray({ currentPage, totalPage });
  paginatorArray.map((i) => {
    const pageNumber = i;
    const button = document.createElement("button");
    button.classList.add("btn", "btn-light", "rounded-circle");
    button.style.width = "40px";
    button.style.height = "40px";
    button.style.fontSize = "12px";
    button.innerText = pageNumber;
    if (pageNumber === currentPage) {
      button.classList.remove("btn-light");
      button.classList.add("btn-primary");
    }
    button.addEventListener("click", () => {
      onChange(pageNumber);
    });
    paginationNumbers.appendChild(button);
    return i;
  });

  pagination.appendChild(paginationNumbers);
  container.appendChild(pagination);
};
