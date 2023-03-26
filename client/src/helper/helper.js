import _ from 'lodash';

export function getSum(transaction, type) {
    let sum = _(transaction)
        .groupBy("type")
        .map((objects, key) => {
            if (!type) return _.sumBy(objects, 'amount');
            return {
                'type': key,
                'color': objects[0].color,
                'total': _.sumBy(objects, 'amount')
            }
        })
        .value()
    return sum;
}

export function getLabels(transaction) {
    let amountSum = getSum(transaction, 'type');
    let Total = _.sum(getSum(transaction));
    let percent = _(amountSum)
        .map(objects => _.assign(objects, { percent : (100 * objects.total) / Total }))
        .value()
    return percent;
}
