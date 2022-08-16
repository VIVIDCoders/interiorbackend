// base --> Product.find({})
// bigQ --> search,page,category etc -obj

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }
  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  filter() {
    let copyQ = this.bigQ;
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    let stringOfCopyQ = JSON.stringify(copyQ);

    stringOfCopyQ = stringOfCopyQ.replace(/\bgte|lte\b/g, (m) => `$${m}`);

    const jsonCopyQ = JSON.parse(stringOfCopyQ);
    this.base = this.base.find(jsonCopyQ);
    return this;
  }

  pager(resultsperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }
    let skipVal = resultsperPage * (currentPage - 1);
    this.base = this.base.limit(resultsperPage).skip(skipVal);
    return this;
  }
}
module.exports = WhereClause