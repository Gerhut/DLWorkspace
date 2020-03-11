import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useState,
} from 'react';
import MaterialTable, { Options, MaterialTableProps } from 'material-table';

import useTableData from '../../../hooks/useTableData';

import { Job } from '../utils';

import DetailPanel from './DetailPanel';

interface JobsTableProps extends Omit<
  MaterialTableProps<Job>,
  'data' | 'options' | 'onChangeRowsPerPage' | 'onChangePage' | 'onRowClick'
> {
  jobs: Array<Job>;
  defaultPageSize?: number;
  selection?: boolean;
  onLastPage?(pageSize: number): void;
}

const JobsTable: FunctionComponent<JobsTableProps> = ({
  jobs,
  defaultPageSize=10,
  selection=false,
  onLastPage,
  ...props
}) => {
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const data = useTableData(jobs);

  const detailPanel = useCallback((job: Job) => {
    return <DetailPanel job={job}/>;
  }, []);
  const handleChangeRowsPerPage = useCallback((pageSize: number) => {
    setPageSize(pageSize);
  }, [setPageSize]);
  const handleChangePage = useCallback((page: number) => {
    const maxPage = Math.ceil(data.length / pageSize) - 1;
    if (page >= maxPage && onLastPage !== undefined) {
      onLastPage(pageSize);
    }
  }, [data, pageSize, onLastPage]);

  const options = useRef<Options>({
    padding: 'dense',
    actionsColumnIndex: -1,
    sorting: false,
    pageSize: defaultPageSize,
    selection
  }).current;

  return (
    <MaterialTable
      data={data}
      options={options}
      detailPanel={detailPanel}
      localization={{
        body: {
          emptyDataSourceMessage: 'No jobs to display'
        },
        pagination: {
          labelRowsSelect: 'jobs',
          labelRowsPerPage: 'Jobs per page',
        },
        toolbar: {
          nRowsSelected: '{0} job(s) selected:'
        }
      }}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onChangePage={handleChangePage}
      {...props}
    />
  );
};

export default JobsTable;
