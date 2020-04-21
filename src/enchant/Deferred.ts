
export default class Deferred {
    _succ: Function
    _fail: Function
    _next: Deferred
    _id
    _tail: Deferred

    constructor() {
        this._tail = this;
    }

    next(func: Function) {
        let q = new Deferred();
        q._succ = func;
        return this._add(q)
    }

    error(func: Function) {
        let q = new Deferred();
        q._fail = func;
        return this._add(q);
    }

    _add(queue: Deferred) {
        // TODO check for assigning `this._tail` after `this._tail._next`
        this._tail._next = queue;
        this._tail = queue;
        return this;
    }

    call(arg?) {
        let received;
        let queue: Deferred = this;

        while (queue && !queue._succ) {
            queue = queue._next;
        }
        if (!(queue instanceof Deferred)) {
            return;
        }

        try {
            received = queue._succ(arg);
        } catch (e) {
            return queue.fail(e);
        }

        if (received instanceof Deferred) {
            Deferred._insert(queue, received);
        } else if (queue._next instanceof Deferred) {
            queue._next.call(received);
        }
    }

    fail(arg) {
        let result, err, queue: Deferred = this;

        while (queue && !queue._fail) {
            queue = queue._next;
        }

        if (queue instanceof Deferred) {
            result = queue._fail(arg);
            queue.call(result);
        } else if (arg instanceof Error) {
            throw arg;
        } else {
            err = new Error('failed in Deferred');
            err.arg = arg;
            throw err;
        }
    }

    static _insert(queue: Deferred, ins: Deferred) {
        if (queue._next instanceof Deferred) {
            ins._tail._next = queue._next;
        }

        queue._next = ins;
    }

    static next(func: Function) {
        let q = new Deferred().next(func);
        q._id = setTimeout(function () { q.call(); }, 0);
        return q;
    }

    static parallel(arg) {
        let q = new Deferred();
        q._id = setTimeout(function () { q.call(); }, 0);
        let progress = 0;
        let ret = (arg instanceof Array) ? [] : {};
        let p = new Deferred();
        for (let prop in arg) {
            if (arg.hasOwnProperty(prop)) {
                progress++;
                (function (queue, name) {
                    queue.next(function (arg) {
                        progress--;
                        ret[name] = arg;
                        if (progress <= 0) {
                            p.call(ret);
                        }
                    }).onerror(function (err) { p.fail(err); });

                    if (typeof queue._id === 'number') {
                        clearTimeout(queue._id);
                    }
                    queue._id = setTimeout(function () { queue.call(); }, 0);
                }(arg[prop], prop));
            }
        }
        if (!progress) {
            p._id = setTimeout(function () { p.call(ret); }, 0);
        }
        return q.next(function () { return p; });
    }
}