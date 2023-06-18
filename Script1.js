let jspdf = document.createElement("script");
jspdf.onload = function () {
    let pdfDocumentName = "Document-GDrive.VIP";
    let doc;

    function generatePDF() {
        let imgTags = document.getElementsByTagName("img");
        let checkURLString = "blob:https://drive.google.com/";
        let validImgTagCounter = 0;

        for (let i = 0; i < imgTags.length; i++) {
            if (imgTags[i].src.substring(0, checkURLString.length) === checkURLString) {
                validImgTagCounter = validImgTagCounter + 1;

                let img = imgTags[i];
                let canvas = document.createElement('canvas');
                let context = canvas.getContext("2d");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                let imgDataURL = canvas.toDataURL();

                let orientation;
                if (img.naturalWidth > img.naturalHeight) {
                    orientation = "l";
                } else {
                    orientation = "p";
                }

                let scalefactor = 1.335;
                let pageWidth = img.naturalWidth * scalefactor;
                let pageHeight = img.naturalHeight * scalefactor;

                if (validImgTagCounter === 1) {
                    doc = new jsPDF({
                        orientation: orientation,
                        unit: "px",
                        format: [pageWidth, pageHeight],
                    });
                    doc.addImage(imgDataURL, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
                } else {
                    doc.addPage([pageWidth, pageHeight], orientation);
                    doc.addImage(imgDataURL, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
                }
            }
        }

        pdfDocumentName = pdfDocumentName + ".pdf";
        doc.save(pdfDocumentName);
    }

    let allElements = document.querySelectorAll("*");
    let chosenElement;
    let heightOfScrollableElement = 0;

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].scrollHeight >= allElements[i].clientHeight) {
            if (heightOfScrollableElement < allElements[i].scrollHeight) {
                heightOfScrollableElement = allElements[i].scrollHeight;
                chosenElement = allElements[i];
            }
        }
    }

    if (chosenElement && chosenElement.scrollHeight > chosenElement.clientHeight) {
        console.log("Auto Scroll");
        let scrollDistance = Math.round(chosenElement.clientHeight / 2);

        let loopCounter = 0;

        function myLoop(remainingHeightToScroll, scrollToLocation) {
            loopCounter = loopCounter + 1;
            console.log(loopCounter);

            setTimeout(function () {
                if (remainingHeightToScroll === 0) {
                    scrollToLocation = scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = chosenElement.scrollHeight - scrollDistance;
                } else {
                    scrollToLocation = scrollToLocation + scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = remainingHeightToScroll - scrollDistance;
                }

                if (remainingHeightToScroll >= chosenElement.clientHeight) {
                    myLoop(remainingHeightToScroll, scrollToLocation);
                } else {
                    setTimeout(function () {
                        generatePDF();
                    }, 1500);
                }
            }, 500);
        }

        myLoop(0, 0);
    } else {
        console.log("No Scroll");
        setTimeout(function () {
            generatePDF();
        }, 1500);
    }
};

jspdf.src = 'https://gdrive.vip/wp-content/uploads/2020/jspdf.debug.js';
document.body.appendChild(jspdf);