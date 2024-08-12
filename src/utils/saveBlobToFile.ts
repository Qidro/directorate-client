export const saveBlobToFile = (data: Blob, name: string) => {
    const url = URL.createObjectURL(data);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}