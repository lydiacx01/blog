<?php
/**
 * 前端custome-table组件的内容格式：
 * (1) 后端
 *  use ViewHelper;
 *  $table = $this->getTable(['名称', '状态', '时间类型', '星期日期/月日期', '时间', '更新时间', '操作'], $tableRows);
 *  $params = array_merge($params, $table);
 * (2) 前端：
 *     <custome-table :head="{{$head}}" :body="{{$body}}"></custome-table>
 * Created by chenxi
 * Date: 2017/3/1
 */

namespace App\Models\viewHelper;



class Table
{
	protected $head = [];
	protected $body = [];

	public function formatHead($head)
	{
		if (!$head || !is_array($head))
			throw new \Exception("表格标题必须是数组！");
		$this->head = $head;
	}

	public function formatBody($rows) {
		if (!$rows || !is_array($rows) || !is_array(end($rows)))
			throw new \Exception("表格体必须是二维数组！");
		$this->body = $rows;
	}


	/**
	 * 为custome-table.vue组件获取table内容
	 *  前端使用组件即可：<custome-table :head="{{$tableHead}}" :body="{{$tableBody}}"></custome-table>
	 * @return array
	 *
	 */
	public function getTableForView() {
		$table = [];
		if ($this->body) {
			$table = [
				'tableHead' =>json_encode($this->head),
				'tableBody'=> json_encode($this->body)
			];
		}

		return $table;
	}
}