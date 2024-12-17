export const serialTableStyles = `
.table-container,
.table-container th,
.table-container td {
  border: 1px solid black;
  border-collapse: collapse;
  word-wrap: anywhere;
  padding: 4px;
}

@media print {
  @page {
    size: auto;
    margin: 10mm 5mm 10mm 5mm;
  }

  .table-container,
  .table-container th,
  .table-container td {
    border: 1px solid black;
    border-collapse: collapse;
    word-wrap: anywhere;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 2px;
    padding-right: 1px;
    font-size: 12px;
  }
}

td {
  min-width: 5rem;
}

th {
  text-align: left;
}

.table-container {
  padding: 2rem;
  width: 100%;
}

.table-container .table-head:not(:first-child) {
  break-before: always;
  page-break-before: always;
}

.table-body-container .table-body:not(:first-child) {
  break-before: always;
  page-break-before: always;
}

.page-br {
  break-before: always;
  page-break-before: always;
}

`;

export const printStyles = `
body {
  display: none;
}

@media print {
  body { 
    display: block;
  }
}
`;
