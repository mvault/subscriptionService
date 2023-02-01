import Request from "./Request";

class Subscription extends Request {
  constructor(data) {
    super(data);
    this.company = data.company;
    this.location = data.location;
    this.item = data.item;
    this.start = data.start;
    this.end = data.end;
    this.due_date = data.due_date;
    this.status = data.status;
    this.recurring = data.recurring;
    this.billing_account = data.billing_account;
    this.is_canceled = data.is_canceled;
    this.canceled_at = data.canceled_at;
    this.cancelation_reason = data.cancelation_reason
  }
}

export default Subscription;
