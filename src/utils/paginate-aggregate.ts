import { Expression, PaginateOptions, PipelineStage } from 'mongoose';

export const paginateAggregate = (
  options: PaginateOptions,
): PipelineStage[] => {
  const sort = options['sort'] ? (options['sort'] as string) : '-_id';
  const sortObject: Record<string, 1 | -1 | Expression.Meta> = sort.includes(
    '-',
  )
    ? { [sort.split('-')[1]]: -1 }
    : { [sort]: 1 };
  const sortObjectAfterGroup: Record<string, 1 | -1 | Expression.Meta> =
    sort.includes('-')
      ? { [`data.${sort.split('-')[1]}`]: -1 }
      : { [`data.${sort}`]: 1 };

  return [
    {
      $facet: {
        paginationOptions: [
          {
            $count: 'totalDocs',
          },
          {
            $addFields: {
              page: options.page || 1,
              offset: 0,
              limit: options.limit,
              totalPages: { $ceil: { $divide: ['$totalDocs', options.limit] } },
              hasPrevPage: options.page > 1,
              prevPage: options.page > 1 ? options.page - 1 : null,
            },
          },
        ],
        metadata: [
          { $sort: sortObject },
          { $skip: options.limit * (options.page - 1) || 0 },
          { $limit: options.limit },
          {
            $group: {
              _id: '$_id',
              count: { $sum: 1 },
              data: { $push: '$$ROOT' },
            },
          },
          { $sort: sortObjectAfterGroup },
        ],
      },
    },
    {
      $unwind: '$metadata',
    },
    {
      $unwind: '$paginationOptions',
    },
    {
      $project: {
        data: '$metadata.data',
        paginationOptions: {
          totalDocs: '$paginationOptions.totalDocs',
          offset: '$paginationOptions.offset',
          limit: '$paginationOptions.limit',
          totalPages: '$paginationOptions.totalPages',
          page: '$paginationOptions.page',
          hasPrevPage: '$paginationOptions.hasPrevPage',
          hasNextPage: {
            $toBool: {
              $cmp: [
                '$paginationOptions.page',
                '$paginationOptions.totalPages',
              ],
            },
          },
          prevPage: '$paginationOptions.prevPage',
          nextPage: {
            $cond: {
              if: {
                $cmp: [
                  '$paginationOptions.page',
                  '$paginationOptions.totalPages',
                ],
              },
              then: { $add: ['$paginationOptions.page', 1] },
              else: null,
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        data: { $push: { $arrayElemAt: ['$data', 0] } },
        paginationOptions: { $first: '$paginationOptions' },
      },
    },
  ];
};

export const handleAggregateOptions = (target): PipelineStage[] => {
  const paginationOptions: PipelineStage[] = [];

  Object.keys(target).forEach((data) => {
    if (data === 'limit') paginationOptions.push({ $limit: target[data] });
    else if (data === 'sort') {
      const sort: Record<string, 1 | any | -1> = target[data].includes('-')
        ? { [target[data].split('-')[1]]: -1 }
        : { [target[data]]: 1 };
      paginationOptions.push({ $sort: sort });
    }
  });

  return paginationOptions;
};
