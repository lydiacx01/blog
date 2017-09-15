<?php
/**
 * 跟前端相关的一些计算放在这里，尽量不要在前端初始化页面时做过多的计算
 * Created by chenxi
 * Date: 2017/2/22
 */

namespace App\Traits\ViewHelper;


use App\Models\viewHelper\Table;

trait TableHelper
{
	/**
	 * 页面索引，前端使用page-index.vue模板
	 * 规则：
	2) currentPage < 6时，显示 1 2 3 4 5 ... maxPage;
	3) currentPage >= 6时，显示 1 ..currentPage -1  currentPage currentPage+1 currentPage + 2 ... maxPage;
	4) currentPage >= maxPage - 4 时，1 ...  maxPage-4 maxPage-3 maxPage-2 maxPage-1 maxPage;
	5) 总结下来，即每次最多显示6个数字，而且1 和 maxPage是必须出现在头尾的
	 * @param $currentPage 当前是第几页
	 * @param $maxPage 总共有多少页
	 * @return string
	 */
	public function getPageIndex($currentPage, $maxPage) {
		if ($currentPage < 1 && $maxPage < 1)
			throw new \Exception("分页索引或最大页数必须不小于1");
		if ($currentPage > $maxPage)
			throw new \Exception("分页索引不能大于最大页数");

		$pageIndex = [];
		$pageLimit = 6;
		$pageOmit = '...';

		//1-maxPage全部显示
		if ($maxPage <= $pageLimit) {
			for ($i = 1; $i <= $maxPage; ++ $i) {
				$pageIndex[] = $i;
			}
			return json_encode($pageIndex);
		}

		//1 2 3 4 5 ... maxPage显示
		if ($currentPage < $pageLimit) {
			for($i = 1; $i < $pageLimit; ++ $i) {
				$pageIndex[] = $i;
			}
			$pageIndex[] = $pageOmit;
			$pageIndex[] = $maxPage;
			return json_encode($pageIndex);
		}

		//1 ... 10 11 12 13 14显示
		$pageIndex[] = 1;
		$pageIndex[] = $pageOmit;
		$start = $maxPage - 4;
		$end = $currentPage + 3;
		if ($currentPage >= $start || $maxPage <= $end) {
			for($i = $start; $i <= $maxPage; ++ $i){
				$pageIndex[] = $i;
			}
			return json_encode($pageIndex);
		}

		//1 .. 5 6 7 8 .. 14 显示
		for ($i = $currentPage - 1; $i < $currentPage + 3; ++ $i){
			$pageIndex[] = $i;
		}
		$pageIndex[] = $pageOmit;
		$pageIndex[] = $maxPage;
		return json_encode($pageIndex);
	}

	/**
	 *  * 前端custome-table组件的内容格式：
	 * (1) 后端
	 *  use ViewHelper;
	 *  $table = $this->getTable(['名称', '状态', '时间类型', '星期日期/月日期', '时间', '更新时间', '操作'], $tableRows);
	 *  $params = array_merge($params, $table);
	 * (2) 前端：
	 *     <custome-table :head="{{$head}}" :body="{{$body}}"></custome-table>
	 * @param $head 一维数组
	 * @param $rows 二维数组，如果某td的值是超链接，则用数组表示，比如：
	 *      [['xx1', 'xx2', ['/config/all' => '查看']]]
	 *         在表格上显示为:
	 *              xx1 xx2 查看
	 *          其中查看是一个超链接，其href=/config/all
	 * @return array
	 */
	public function getTable($head, $rows) {
		$table = new Table();
		if ($rows) {
			$table->formatHead($head);
			$table->formatBody($rows);
		}
		return $table->getTableForView();
	}
}