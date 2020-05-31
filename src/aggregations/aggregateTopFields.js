'use strict'

const offsetByRange = require('../utils/offsetByRange')

module.exports = (id, properties, range) => {

	const aggregation = [
		{
			$match: {}
		},
		{
			$group: {
				_id: {},
				count: {
					$sum: 1
				}
			}
		},
		{
			$sort: {
				count: -1
			}
		},
		{
			$limit: 30
		}
	]

	if (id != null) {
		aggregation[0].$match.domainId = id
	}

	properties.forEach((property) => {
		aggregation[0].$match[property] = { $ne: null }
		aggregation[1].$group._id[property] = `$${ property }`
	})

	const dateOffset = offsetByRange(range)
	if (dateOffset != null) {
		aggregation[0].$match.created = { $gte: dateOffset }
	}

	return aggregation

}