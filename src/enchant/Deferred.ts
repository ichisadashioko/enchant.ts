
/**
 * See http://cho45.stfuawsc.com/jsdeferred
 * 
 * @example
 * 
 * enchant.Deferred.next(function() {
 *   return 42;
 * }).next(function(n) {
 *   console.log(n);
 * }).next(function() {
 *   return core.load('img.png'); // wait loading
 * }).next(function() {
 *   var img = core.assets['img.png'];
 *   console.log(img instanceof enchant.Surface); // true
 *   throw new Error('!!!');
 * }).next(function() {
 *   // skip
 * }).error(function(err) {
 *   console.log(err.message); // !!!
 * })
 */
export default class Deferred {
    _succ?: Function
    _fail?: Function
    _next?: Deferred
    _id?: number
    _tail: Deferred

    constructor() {
        this._succ = this._fail = this._next = this._id = null
        this._tail = this
    }

    next(func: (d: Deferred) => void) {
        let q = new Deferred()
        q._succ = func
        return this._add(q)
    }

    error(func: Function) {
        let q = new Deferred()
        q._fail = func
        return this._add(q)
    }

    _add(queue: Deferred) {
        // TODO check for assigning `this._tail` after `this._tail._next`
        this._tail._next = queue
        this._tail = queue
        return this
    }

    call(args?) {
        let received
        let queue: Deferred = this

        while (queue && !queue._succ) {
            queue = queue._next
        }
        if (!(queue instanceof Deferred)) {
            return
        }

        try {
            received = queue._succ(args)
        } catch (e) {
            return queue.fail(e)
        }

        if (received instanceof Deferred) {
            Deferred._insert(queue, received)
        } else if (queue._next instanceof Deferred) {
            queue._next.call(received)
        }
    }

    fail(args) {
        let result, err, queue: Deferred = this

        while (queue && !queue._fail) {
            queue = queue._next
        }

        if (queue instanceof Deferred) {
            result = queue._fail(args)
            queue.call(result)
        } else if (args instanceof Error) {
            throw args
        } else {
            err = new Error('failed in Deferred')
            err.arg = args
            throw err
        }
    }

    static _insert(queue: Deferred, ins: Deferred) {
        if (queue._next instanceof Deferred) {
            ins._tail._next = queue._next
        }

        queue._next = ins
    }

    static next(func: Function) {
        let q = new Deferred().next(func)
        q._id = setTimeout(function () { q.call() }, 0)
        return q
    }

    static parallel(args: Record<string, Deferred>) {
        let q = new Deferred()
        q._id = setTimeout(function () { q.call() }, 0)
        let progress = 0
        let ret: Deferred[] | Record<string|number, Deferred> = (args instanceof Array) ? [] : {}
        let p = new Deferred()
        for (let prop in args) {
            if (args.hasOwnProperty(prop)) {
                progress++
                (function (queue: Deferred, name) {
                    queue.next(function (args) {
                        progress--
                        ret[name] = args
                        if (progress <= 0) {
                            p.call(ret)
                        }
                    }).error(function (err) { p.fail(err) })

                    if (typeof queue._id === 'number') {
                        clearTimeout(queue._id)
                    }

                    queue._id = setTimeout(function () { queue.call() }, 0)
                }(args[prop], prop))
            }
        }
        if (!progress) {
            p._id = setTimeout(function () { p.call(ret) }, 0)
        }

        return q.next(function () { return p })
    }
}