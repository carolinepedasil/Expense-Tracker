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

export function chart_Data(transaction, custom) {
    let bg = _.map(transaction, a => a.color)
    bg = _.uniq(bg)
    let dataValue = getSum(transaction)

    const config = {
        data: {
            datasets: [{
              data: dataValue,
              backgroundColor: bg,
              hoverOffset: 4,
              borderRadius: 30,
              spacing: 10
            }]
        },
        options: {
            cutout: 115
        }
    }

    return custom ?? config;
}

export function getTotal(transaction) {
    return _.sum(getSum(transaction));
}
