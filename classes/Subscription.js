import Request from "./Request";

class Subscription extends Request {
  constructor(data) {
    super(data);
    this.company = data.company;
    this.location = data.location;
    this.item = data.item;
    this.status = data.status;
    this.recurring = data.recurring;
    this.start = data.start;
    this.end = data.end;
    this.due_date = data.due_date;
  }
}

export default Subscription;
