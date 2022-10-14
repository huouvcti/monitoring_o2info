const paging = (currentPage, pageSize) => {
    const default_start_page = 0;
    const page_size = pageSize;
    if (currentPage < 0 || !currentPage) currentPage = default_start_page;

    let result = {
        offset: (currentPage) * page_size,
        limit: Number(page_size),
        currentPage
    }

    return result;
}


module.exports = {
    paging
}   