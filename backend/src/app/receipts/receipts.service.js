const puppeteer = require("puppeteer");
const path = require("node:path");
const fs = require("node:fs");
const ejs = require("ejs");
const mime = require("mime-types");

const prepareDataForReceipt = (item) => {
    const { stock_ledgers: sl, remarks } = item;
    if (!Array.isArray(sl)) return [];

    const [slFirstItem] = sl;

    const createMaterialData = (slArray, predicate) => {
        let sumOfAmounts = 0;
        let sumOfQty = 0;
        let slItem;

        const materialData = slArray
            .filter(predicate)
            .map((materialItem, index) => {
                const amount = Number(materialItem.value);
                sumOfAmounts += amount;
                sumOfQty += Math.abs(materialItem.quantity);

                if (!slItem && materialItem.quantity) slItem = { ...materialItem, quantity: Math.abs(materialItem.quantity) };

                return {
                    ...materialItem,
                    serialNumber: index + 1,
                    quantity: Math.abs(materialItem.quantity),
                    amount: amount.toFixed(2),
                    remarks: materialItem.remarks || item.remarks
                };
            });

        return {
            materialData,
            sumOfAmounts: sumOfAmounts.toFixed(2),
            sumOfQty: sumOfQty.toFixed(2),
            slItem
        };
    };

    const {
        materialData,
        sumOfAmounts,
        sumOfQty,
        slItem: slPositiveQty
    } = createMaterialData(sl, (slItem) => slItem.quantity > 0);
    const {
        materialData: materialDataNegativeQty,
        sumOfAmounts: sumOfNegativeAmounts,
        sumOfQty: sumOfNegativeQty,
        slItem: slNegativeQty
    } = createMaterialData(sl, (slItem) => slItem.quantity < 0);

    return {
        ...item,
        requestNumber: slFirstItem?.requestNumber,
        projectName: slFirstItem?.project?.name,
        remarks: remarks || item?.remarks || "",
        fromProject: slNegativeQty?.project,
        toProject: slPositiveQty?.project,
        fromOrganization: slNegativeQty?.organization,
        toOrganization: slPositiveQty?.organization,
        fromStore: slNegativeQty?.organization_store,
        toStore: slPositiveQty?.organization_store,
        otherStore: slFirstItem?.other_store,
        otherProjectId: slFirstItem?.otherProjectId,
        fromStoreLocation: slNegativeQty?.organization_store_location,
        toStoreLocation: slPositiveQty?.organization_store_location,
        fromOtherStoreLocation: slNegativeQty?.other_store_location,
        materialData,
        materialDataNegativeQty,
        sumOfAmounts: +sumOfAmounts > 0 ? sumOfAmounts : sumOfNegativeAmounts,
        sumOfNegativeAmounts:
            +sumOfAmounts > 0 ? sumOfAmounts : sumOfNegativeAmounts,
        sumOfQty,
        sumOfNegativeQty
    };
};

const pickKeyFromTxDataObject = (obj, key = "requestNumber") => {
    if (!obj) return obj;
    if (obj?.stock_ledgers?.[0]?.[key]) {
        return obj?.stock_ledgers?.[0]?.[key];
    }
    if (obj?.[0]?.[key]) {
        return obj?.[0]?.[key];
    }
    if (obj?.[key]) {
        return obj?.[key];
    }
    return "";
};

const parseAddressFromObject = (obj) => {
    if (!obj) return "";
    try {
        const city = obj.city || obj.cities;
        return `${obj.address}, ${city?.name}, ${city?.state?.name}${
            city?.state?.country?.name ? `, ${city.state.country.name}` : ""
        } - ${obj?.pincode || obj?.pinCode || ""}`;
    } catch {
        return "";
    }
};

const processDate = (_date) => {
    const dateObj = new Date(_date);
    if (!_date || Number.isNaN(dateObj)) {
        throw new Error("Invalid Date");
    }

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hoursRaw = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const hours = hoursRaw % 12 || 12;
    const amPm = hoursRaw >= 12 ? "PM" : "AM";

    return { day, month, year, hours, minutes, amPm };
};

const formatDate = (_date) => {
    try {
        const { day, month, year } = processDate(_date);
        return `${day}-${month}-${year}`;
    } catch (error) {
        return "Invalid Date";
    }
};

const formatTimestamp = (_date) => {
    try {
        const { day, month, year, hours, minutes, amPm } = processDate(_date);
        return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
    } catch (error) {
        return "Invalid Date";
    }
};

const formatIndianNumber = (num) => {
    if (!num) return "";

    let strNum = num.toString();

    let decimalPart = "";
    if (strNum.includes(".")) {
        [strNum, decimalPart] = strNum.split(".");
    }

    let lastThree = strNum.substring(strNum.length - 3);

    const otherDigits = strNum.substring(0, strNum.length - 3);

    if (otherDigits !== "") {
        lastThree = `,${lastThree}`;
    }

    const res = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return decimalPart ? `${res}.${decimalPart}` : res;
};

const getHighestApproverName = (currentApproversData, allApproversData) => {
    if (
        !currentApproversData
        || currentApproversData.length === 0
        || !allApproversData
        || allApproversData.length === 0
    ) {
        return "";
    }

    const highestRankApproverId = currentApproversData.reduce(
        (max, user) => (user.rank > max.rank ? user : max),
        currentApproversData[0]
    )?.approverId;

    return allApproversData.find((item) => item.id === highestRankApproverId)
        ?.user?.name;
};

const createApproverList = (allApproversData = [], approvedList = []) => {
    let requestIsRejected = false;

    const approvedListSorted = approvedList.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    return allApproversData
        .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
        .map((approver) => {
            const approved = approvedListSorted.find(
                (approved) => approved.approverId === approver.id
            );
            const statusNum = parseInt(approved?.status);
            let status = "";

            if (statusNum === 1) {
                status = "Approved";
            } else if (!Number.isNaN(statusNum)) {
                requestIsRejected = true;
                status = "Rejected";
            } else if (requestIsRejected) {
                status = "N/A";
            } else if (approvedListSorted.length) {
                if (parseInt(approver.rank) === parseInt(approvedListSorted[approvedListSorted.length - 1].rank) + 1) {
                    status = "Awaiting Action";
                } else {
                    status = "Pending";
                }
            } else if (approvedListSorted.length === 0 && parseInt(approver.rank) === 1) {
                status = "Awaiting Action";
            } else {
                status = "Pending";
            }

            return {
                name: approver.user.name,
                action: status,
                time: approved?.updatedAt,
                remarks: approved?.remarks
            };
        });
};

const parentOrganizationFetchers = {
    getTopmostOrganization: (data) => data?.organization?.parent || data?.organization,
    getImmediateParentOrganization: (data) => data?.organisationBranch || data?.organization,
    getBranchOrganization: (data) => data?.organisationBranch,
    getBranchOrganizationOnly: (data) => data?.organisationBranch
        || (data?.organization?.parent ? data.organization : "")
};

const rupeeAmountToWords = (numb) => {
    if (!numb || Number.isNaN(numb)) return "";

    const units = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine"
    ];
    const teens = [
        "",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen"
    ];
    const tens = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"
    ];

    function convertToWords(num1) {
        if (num1 === 0) return "";
        if (num1 < 10) return units[num1];
        if (num1 <= 19 && num1 > 10) return teens[num1 - 10];
        if (num1 < 100) {
            return `${tens[Math.floor(num1 / 10)]} ${convertToWords(
                num1 % 10
            )}`;
        }
        if (num1 < 1000) {
            return `${units[Math.floor(num1 / 100)]} Hundred ${convertToWords(
                num1 % 100
            )}`;
        }
        if (num1 < 100000) {
            return `${convertToWords(
                Math.floor(num1 / 1000)
            )} Thousand ${convertToWords(num1 % 1000)}`;
        }
        if (num1 < 10000000) {
            return `${convertToWords(
                Math.floor(num1 / 100000)
            )} Lakh ${convertToWords(num1 % 100000)}`;
        }
        return `${convertToWords(
            Math.floor(num1 / 10000000)
        )} Crore ${convertToWords(num1 % 10000000)}`;
    }

    let words = "";
    const integerPart = numb.split(".")[0].replaceAll(",", "");
    const [, decimalPart] = numb.split(".");

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(integerPart) || (decimalPart && isNaN(decimalPart))) return "";

    words = convertToWords(parseInt(integerPart));

    let decimalWords = "";

    if (decimalPart && parseInt(decimalPart) > 0) {
        for (
            let j = 0;
            j < (decimalPart.length <= 2 ? decimalPart.length : 2);
            j++
        ) {
            decimalWords += ` ${
                j === 0 && decimalPart[j] === "0"
                    ? ""
                    : units[parseInt(decimalPart[j])]
            }`;
        }
    }

    decimalWords = decimalWords.trim();
    words = words.trim();

    if (!words && !decimalWords) return "";

    decimalWords = !decimalWords ? "Zero" : decimalWords;

    return `${words ? `Rupees ${words}` : ""}${
        decimalWords && words ? " And " : ""
    }${decimalWords ? `${decimalWords} Paise` : ""} Only`.trim();
};

const convertIfDate = (value, isTimestamp) => {
    let result;
    if (isTimestamp) {
        result = formatTimestamp(value);
    } else {
        result = formatDate(value);
    }
    if (result !== "Invalid Date") return result;
    return value;
};

const pdfStyles = `<style>
.pdf-top-section-heading {
    padding-top: 1.5rem;
}
.pdf-h1 {
  font-size: 1.2rem;
}
.pdf-h2 {
  font-size: 1.1rem;
}
.pdf-h3 {
  font-size: 1.0rem;
}
.content-center {
  text-align: center;
}
.overlapping-container {
  position: relative;
  z-index: 1000;
}
.position-absolute {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1010;
}
@media print {
    table * {
        page-break-inside: auto !important;
        page-break-after: auto;
    }
    .avoid-page-break-inside {
        break-inside: avoid;
        page-break-inside: avoid;
    }
    .row {
        break-inside: avoid;
        page-break-inside: avoid;
    }
}
</style>`;

const globalStyleOverrides = `
<style>
  /* outer top border */
  .table-bordered > thead > tr:first-child > th {
    border-top: 2px solid #707070 !important;
  }

  /* outer top border */
  .table-bordered > tbody > tr:first-child > td {
    border-top: 2px solid #707070 !important;
  }

  /* outer bottom border */
  .table-bordered > tbody > tr:last-child > td {
    border-bottom: 2px solid #707070 !important;
  }

  /* outer left border */
  .table-bordered > thead > tr > th:first-child,
  .table-bordered > tbody > tr > td:first-child {
    border-left: 2px solid #707070 !important;
  }

  /* outer right border */
  .table-bordered > thead > tr > th:last-child,
  .table-bordered > tbody > tr > td:last-child {
    border-right: 2px solid #707070 !important;
  }

  .custom-border {
    border: 2px solid #707070 !important;
    border-radius: 2px !important;
  }

  .custom-border-bottom {
    border-bottom: 2px solid #707070 !important;
  }

  .material-heading {
    font: normal normal 600 30px/36px Public Sans;
    letter-spacing: 0;
    color: #242424;
    text-align: left;
    opacity: 1;
  }

  .table-bordered th,
  .table-bordered td {
    border-collapse: separate;
  }

  .amount-in-words-span {
    border-right: 1px solid rgb(222, 226, 230);
    padding-right: 22px;
    margin-right: 5px;
  }

  .signature-block {
    border: 2px solid #707070;
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 5px;
  }

  .no-padding {
    padding-right: 0;
    padding-left: 0;
  }

  .no-container-margin {
    margin-left: 10px !important;
    padding-right: 20px !important;
    padding-left: 10px !important;
    margin-right: 0 !important;
  }

  .horizontal-bordered-blocks-container div:first-child {
    padding-right: 0;
  }

  .horizontal-bordered-blocks-container div:last-child {
    padding-left: 0;
  }

  .horizontal-bordered-blocks-container div:not(:first-child):not(:last-child) {
    padding-right: 0;
    padding-left: 0;
  }

  .horizontal-bordered-blocks-container div:not(:first-child) {
    margin-left: -2px;
  }

  .bordered-definitions-container div:not(:first-child) {
    margin-top: -2px;
  }
</style>
`;

async function renderTemplate(dataForEJS, templateName) {
    try {
        const templatePath = path.join(
            `${__dirname}../../../pages/`,
            templateName
        );
        const template = fs.readFileSync(templatePath, "utf-8");
        return ejs.render(`${pdfStyles}${globalStyleOverrides}${template}`, {
            dataForEJS
        });
    } catch (error) {
        console.log("renderTemplate: error: ", error);
        return "<html><body><p>Could Not Render Template</p></body></html>";
    }
}

async function generatePdf(html) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 300000
    });

    await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "50px",
            left: "28px",
            right: "28px",
            bottom: "70px"
        },
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
        <div style="border-top: solid 1px #bbb; width: 100%; font-size: 9px;
            padding: 5px 5px 0; color: #bbb; position: relative;">
            <div style="display: none; position: absolute; left: 5px; top: 5px;"><span class="date"></span></div>
            <div style="position: absolute; right: 15px; top: 5px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
        </div>
      `,
        printBackground: true
    });

    await browser.close();
    return pdfBuffer;
}

const generatePdfBuffer = async (data, templateName = "template.ejs") => {
    const html = await renderTemplate(data, templateName);
    const pdfBuffer = await generatePdf(html);
    return pdfBuffer;
};

const getStore = (val) => {
    if (
        val.transaction_type
        && val.transaction_type.name
        && val.transaction_type.name === "MRR"
    ) { return val.fromStoreId; } else return val.toStoreId;
};

const groupRequestData = (dataArray) => {
    const respArr = [];
    const newObject = {};
    dataArray.forEach((val) => {
        const pushedData = {
            name: val.material.name,
            code: val.material.code,
            hsnCode: val.material.hsnCode,
            uom: val.uom.name,
            quantity: val.requestedQuantity,
            remarks: val.remarks
        };

        const key = val.referenceDocumentNumber + val.transactionTypeId + getStore(val);

        if (newObject[key] && newObject[key].materialData) {
            newObject[key].materialData.push(pushedData);
        } else {
            val.materialData = [pushedData];
            newObject[key] = val;
        }
    });
    Object.keys(newObject).forEach((key) => {
        respArr.push(newObject[key]);
    });
    return respArr;
};

async function generateReceiptResponse(
    isPdfDownload,
    dataForEJS,
    templateName
) {
    if (isPdfDownload) {
        const pdfBuffer = await generatePdfBuffer(dataForEJS, templateName);

        return {
            buffer: pdfBuffer,
            contentType: "application/pdf",
            filename: "document.pdf"
        };
    } else {
        const outputData = await renderTemplate(dataForEJS, templateName);

        return { renderedTemplate: outputData };
    }
}

const templateNames = {
    grnReceipt: "grn-receipt.ejs",
    mrfReceipt: "mrf-receipt.ejs",
    minReceipt: "min-receipt.ejs",
    mrrReceipt: "mrr-receipt.ejs",
    mrnReceipt: "mrn-receipt.ejs",
    returnMrnReceipt: "return-mrn-receipt.ejs",
    ltlReceipt: "ltl-receipt.ejs",
    stsrcReceipt: "stsrc-receipt.ejs",
    srctsReceipt: "srcts-receipt.ejs",
    stcReceipt: "stc-receipt.ejs",
    ctsReceipt: "cts-receipt.ejs",
    strReceipt: "str-receipt.ejs",
    stoReceipt: "sto-receipt.ejs",
    stoGrnReceipt: "sto-grn-receipt.ejs",
    ptpReceipt: "ptp-receipt.ejs",
    ptpGrnReceipt: "ptp-grn-receipt.ejs",
    consumptionRequestReceipt: "consumption-request-receipt.ejs",
    consumptionReceipt: "consumption-receipt.ejs",
    devolutionView: "devolution-view.ejs"
};

const getGstNumberFrom = (item) => item?.gst_number || item?.gstNumber;

const transactionIsCancelled = (data) => {
    const isCancelled = (obj) => obj?.isCancelled
        || (!Number.isNaN(Number(obj?.status)) && +obj.status !== 1);

    return !!(
        isCancelled(data)
        || (data?.[0] && isCancelled(data[0]))
        || (data?.stock_ledgers?.[0] && isCancelled(data?.stock_ledgers?.[0]))
        || (data?.[0]?.stock_ledgers?.[0]
            && isCancelled(data?.[0]?.stock_ledgers?.[0]))
    );
};

const getLogoBufferFrom = (obj, useDefaultDirectoryStructure = true) => {
    let logoForDisplay;
    try {
        if (obj?.logo) {
            let logoPath = JSON.parse(obj.logo);
            logoPath = logoPath[0];
            logoPath = useDefaultDirectoryStructure
                ? `${process.cwd()}/public/Genus/WFM/${logoPath}`
                : `${process.cwd()}/../frontend/public/${logoPath}`;
 
            const data = fs.readFileSync(logoPath);
            const ext = path.extname(logoPath);
            const mimeType = mime.lookup(ext);
            const base64Image = Buffer.from(data).toString("base64");
            const dataUrl = `data:${mimeType};base64,${base64Image}`;
 
            logoForDisplay = dataUrl;
        }
    } catch (error) {
        console.log("getLogoBufferFrom: error: ", error);
    }
    return logoForDisplay;
};

module.exports = {
    templateNames,
    prepareDataForReceipt,
    pickKeyFromTxDataObject,
    parseAddressFromObject,
    parentOrganizationFetchers,
    generatePdfBuffer,
    renderTemplate,
    getHighestApproverName,
    getLogoBufferFrom,
    formatIndianNumber,
    groupRequestData,
    rupeeAmountToWords,
    convertIfDate,
    getStore,
    getGstNumberFrom,
    transactionIsCancelled,
    generateReceiptResponse,
    createApproverList
};
