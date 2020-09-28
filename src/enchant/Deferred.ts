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

    _succ: Function | null
    _fail: Function | null
    _next: Deferred | null
    _id: number | null
    _tail: Deferred

    constructor() {
        this._succ = this._fail = this._next = this._id = null
        this._tail = this
    }

    next(func: Function) {
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
        this._tail._next = queue
        this._tail = queue
        return this
    }

    call(args?: any) {
        let received
        let queue: Deferred | null = this

        while (queue && !queue._succ) {
            queue = queue._next
        }

        if (queue instanceof Deferred) {
            try {
                if (queue._succ) {
                    received = queue._succ(args)
                }
            } catch (e) {
                return queue.fail(e)
            }

            if (received instanceof Deferred) {
                Deferred._insert(queue, received)
            } else if (queue._next instanceof Deferred) {
                queue._next.call(received)
            }
        }
    }

    fail(arg: any) {
        let queue: Deferred | null = this

        while (queue && !queue._fail) {
            queue = queue._next
        }

        if (queue instanceof Deferred) {
            if (queue._fail) {
                let result = queue._fail(arg)
                queue.call(result)
            } else {
                queue.call()
            }

        } else if (arg instanceof Error) {
            throw arg
        } else {
            let err = new Error('failed in Deferred')
            console.log(arg)
            // @ts-ignore
            err.arg = arg
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

    /**
     * @example
     * // array
     * enchant.Deferred.parallel([
     *   enchant.Deferred.next(function(){
     *     return 24
     *   }),
     *   enchant.Deferred.next(function(){
     *     return 42
     *   })
     * ]).next(function(arg){
     *   console.log(arg) // [ 24, 42 ]
     * })
     * 
     * @param args 
     */
    static parallel(args: Record<string, Deferred>) {
        let q = new Deferred()
        q._id = setTimeout(function () { q.call() }, 0)
        let progress = 0

        let ret: Record<string, Deferred> = {}

        let p = new Deferred()
        for (let prop in args) {
            if (args.hasOwnProperty(prop)) {
                progress++
                (function (queue: Deferred, name: string) {
                    queue.next(function (arg: any) {
                        progress--
                        ret[name] = arg
                        if (progress <= 0) {
                            p.call(ret)
                        }
                    }).error(function (err: Error) {
                        p.fail(err)
                    })

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
