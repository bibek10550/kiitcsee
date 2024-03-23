// folder download
async function downloadFolderAsZip(folderName, button) {
    // Store the original button text
    const originalButtonText = button.innerText;

    button.innerText = 'Downloading...';
    button.disabled = true;
    // const githubToken = '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';

    // Get the URL from the folderUrls object
    // let url = folderUrls[folderName];
    // let url = folderUrls1stNote[folderName];

    // Check if the URL is not found in folderUrls, try folderUrls1stNote
    // if (!url && folderUrls) {
    //     url = folderUrls[folderName];
    // }


    let url;

    // Get the URL from the folderUrls object
    if (folderUrls.hasOwnProperty(folderName)) {
        url = folderUrls[folderName];
    } else if (folderUrls1stNote && folderUrls1stNote.hasOwnProperty(folderName)) {
        url = folderUrls1stNote[folderName];
    } else if (folderUrls1stPYQs && folderUrls1stPYQs.hasOwnProperty(folderName)) {
        url = folderUrls1stPYQs[folderName];
    } else if (folderUrls2ndNote && folderUrls2ndNote.hasOwnProperty(folderName)) {
        url = folderUrls2ndNote[folderName];
    } else if (folderUrls2ndPYQs && folderUrls2ndPYQs.hasOwnProperty(folderName)) {
        url = folderUrls2ndPYQs[folderName];
    } else if (folderUrls3rdNote && folderUrls3rdNote.hasOwnProperty(folderName)) {
        url = folderUrls3rdNote[folderName];
    } else if (folderUrls3rdPYQs && folderUrls3rdPYQs.hasOwnProperty(folderName)) {
        url = folderUrls3rdPYQs[folderName];
    } else if (folderUrls4thNote && folderUrls4thNote.hasOwnProperty(folderName)) {
        url = folderUrls4thNote[folderName];
    } else if (folderUrls4thPYQs && folderUrls4thPYQs.hasOwnProperty(folderName)) {
        url = folderUrls4thPYQs[folderName];
    } else if (folderUrls5thNote && folderUrls5thNote.hasOwnProperty(folderName)) {
        url = folderUrls5thNote[folderName];
    } else if (folderUrls5thPYQs && folderUrls5thPYQs.hasOwnProperty(folderName)) {
        url = folderUrls5thPYQs[folderName];
    } else if (folderUrls6thNote && folderUrls6thNote.hasOwnProperty(folderName)) {
        url = folderUrls6thNote[folderName];
    } else if (folderUrls6thPYQs && folderUrls6thPYQs.hasOwnProperty(folderName)) {
        url = folderUrls6thPYQs[folderName];
    }

    // Check if the URL is found
    if (!url) {
        console.error(`Folder URL not found for ${folderName}`);
        button.innerText = originalButtonText;
        button.disabled = false;
        return;
    }

    // Check if the URL contains "github.com"
    if (url.includes("github.com")) {
        // Replace "github.com" with "api.github.com/repos"
        url = url.replace("github.com", "api.github.com/repos");
    }

    // Check if the URL contains "tree/main"
    if (url.includes("tree/main")) {
        // Replace "tree/main" with "contents"
        url = url.replace("tree/main", "contents");
    }

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch folder contents for ${folderName}`);
            return;
        }

        const folderContents = await response.json();
        const zip = new JSZip();

        for (const item of folderContents) {
            if (item.type === 'file') {
                const fileUrl = item.download_url;
                const fileResponse = await fetch(fileUrl);
                const fileBlob = await fileResponse.blob();
                zip.file(item.name, fileBlob);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });

        const link = document.createElement('a');
        link.download = `${folderName}.zip`;
        link.href = URL.createObjectURL(content);
        link.click();
    } catch (error) {
        console.error(`Failed to download ${folderName} folder:`, error);
    } finally {
        // Restore the original button text
        button.innerText = originalButtonText;
        button.disabled = false;
    }
}


// file downloads
async function downloadFiles(fileNames, button) {
    // Store the original button text
    const originalButtonText = button.innerText;

    button.innerText = 'Downloading...';
    button.disabled = true;

    try {
        const zip = new JSZip();

        for (const fileName of fileNames) {
            // const urls = fileUrls[fileName];
            const urls = fileUrls[fileName] || fileUrls1stNote[fileName] || fileUrls1stPYQs[fileName] || fileUrls2ndNote[fileName] || fileUrls2ndPYQs[fileName] || fileUrls3rdNote[fileName] || fileUrls3rdPYQs[fileName] || fileUrls4thNote[fileName] || fileUrls4thPYQs[fileName] || fileUrls5thNote[fileName] || fileUrls5thPYQs[fileName] || fileUrls6thtNote[fileName] || fileUrls6thPYQs[fileName];

            if (!urls || !urls.length) {
                console.error(`No URL found for file ${fileName}`);
                continue;
            }

            // Check if there's only one URL for this file
            if (urls.length === 1) {
                const url = urls[0];

                // Check if the URL contains "github.com"
                let modifiedUrl = url.includes("github.com") ? url.replace("github.com", "raw.githubusercontent.com") : url;

                // Check if the URL contains "/blob/"
                modifiedUrl = modifiedUrl.includes("/blob/") ? modifiedUrl.replace("/blob/", "/") : modifiedUrl;

                const response = await fetch(modifiedUrl);

                if (!response.ok) {
                    console.error(`Failed to fetch file ${fileName}`);
                    continue;
                }

                const fileBlob = await response.blob();

                // Extract file name from the URL and replace %20 with spaces
                const decodedFileName = decodeURIComponent(modifiedUrl.split('/').pop());

                const link = document.createElement('a');
                link.download = decodedFileName;
                link.href = URL.createObjectURL(fileBlob);
                link.click();
            } else {
                for (const url of urls) {
                    // Check if the URL contains "github.com"
                    let modifiedUrl = url.includes("github.com") ? url.replace("github.com", "raw.githubusercontent.com") : url;

                    // Check if the URL contains "/blob/"
                    modifiedUrl = modifiedUrl.includes("/blob/") ? modifiedUrl.replace("/blob/", "/") : modifiedUrl;

                    const response = await fetch(modifiedUrl);

                    if (!response.ok) {
                        console.error(`Failed to fetch file ${fileName}`);
                        continue;
                    }

                    const fileBlob = await response.blob();

                    // Extract file name from the URL and replace %20 with spaces
                    const decodedFileName = decodeURIComponent(modifiedUrl.split('/').pop());

                    zip.file(decodedFileName, fileBlob);
                }
            }
        }

        if (Object.keys(zip.files).length > 0) {
            const content = await zip.generateAsync({ type: 'blob' });

            const link = document.createElement('a');
            link.download = `files.zip`;
            link.href = URL.createObjectURL(content);
            link.click();
        }
    } catch (error) {
        console.error(`Failed to download files:`, error);
    } finally {
        // Restore the original button text
        button.innerText = originalButtonText;
        button.disabled = false;
    }
}
