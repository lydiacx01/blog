<?php
/**
 * 多级联动
 * 配合前端的multi-level-linkage使用,比如：
 *  <multi-level-linkage :level="4" :select-names="{{$selectNames}}"
	:default-texts="{{$defaultTexts}}"
	:urls="{{$urls}}"
	:init-values="{{$content}}">

</multi-level-linkage>
 * 具体使用可查看AreaHelper
 * Created by chenxi
 * Date: 2017/4/27
 */

namespace App\Models\viewHelper;

use Illuminate\Routing\UrlGenerator;
class MultiLevelLinkage
{
	protected $isInit; //是否为第一级联动，若为true,getValue前需要设置其他属性的值
	protected $level; //几级联动
	protected $selectNames; //每个select的name属性
	protected $defaultTexts; //每个select的默认文本，也就是第一个option的文本，值为空
	protected $urls; //从第3级联动开始，需要提供$this->level - 2个网址，用于请求数据
    protected $required;

	public function __construct($isInit = true, $level = 2, array $selectNames = [], array $defaultTexts = [], array $urls=[], $required = false)
	{
		$this->isInit = $isInit;
		$this->level = intval($level);
		$this->selectNames = $selectNames;
		$this->defaultTexts = $defaultTexts;
		$this->urls = $urls;
        $this->required = $required;
	}

	protected function check () {
		if ($this->level < 2) {
			throw new \Exception("多级联动至少得为2级联动！");
		}
		if (count($this->selectNames) !== $this->level) {
			throw new \Exception("多级联动的名称错误！");
		}
		if (count($this->defaultTexts) !== $this->level) {
			throw new \Exception("多级联动默认文本错误！");
		}
		if (count($this->urls) !== ($this->level - 2)) {
			throw new \Exception("多级联动的URL错误！");
		}
	}

	//select中一个option的格式
	protected function formatOneOption($text, $value) {
		return ['text' => $text, 'value' => $value];
	}

	/**
	 * 获取某个联动的option值，分为第一级联动和高级联动，高级联动>=3级联动，第2级联动是从第一级联动的data-title中取值
	 * (1)  * 格式化第一级联动的值
	 *  假如root = ['d1' => ['d2Text' => 'd2Value']]， 渲染到前端，第一级联动A就是：
	 *      <select>
	 *          <option value="d1" data-title="[['text': 'd2Text', 'value': 'd2Value']]" >d1</option>
	 *      </select>
	 *  假如A发送了change事件，第二级联动被渲染为：
	 *      <select>
	 *          <option value="d2Value" >d2Text</option>
	 *      </select>
	 *
	 * (2)  * 格式化第3级或以上联动的值，比如第4级、第5级联动，这些联动的值都是通过HTTP GET请求获取
	 * 假如later = ['d2Text' => 'd2Value']， 渲染到前端，第一级联动A就是：
	 *      <select>
	 *          <option value="d2Value" >d2Text</option>
	 *      </select>
	 * @param array $unformat
	 * @return array
	 * @throws \Exception
	 */
	public function formattedValue (array $unformat) {
		$format = [];

		//第一级联动的值格式化
		if ($this->isInit) {
			$this->check();
			if (!is_array(current($unformat))) {
				throw new \Exception("多级联动中第一级联动的参数必须是二维数组！");
			}
			foreach ($unformat as $value => $attr) {
				$list = [];
				foreach ($attr as $attrValue => $attrText) {
					$list[] = $this->formatOneOption($attrText, $attrValue);
				}
				$format[$value] = json_encode($list);
			}
			$format = [
				'content' => json_encode($format),
				'selectNames' => json_encode($this->selectNames),
				'defaultTexts' => json_encode($this->defaultTexts),
				'urls' => json_encode($this->urls),
				'level' => $this->level
			];
		} else {
			if (is_array(current($unformat))) {
				throw new \Exception("多级联动中第三级或更高级联动的参数必须是一维数组！");
			}
			foreach ($unformat as $value => $text) {
				$format[] = $this->formatOneOption($text, $value);
			}
			$format = ['content' => $format];
		}

		$res = [
		    'selectParams' => $this->getRequiredParam(),
            'status' => 'success'
        ];
		$res = array_merge($res, $format);
		return $res;
	}

	protected function getRequiredParam() {
	    $param = [];
        for ($i = 1; $i <= $this->level; ++$i) {
            $id = 'select-level-' . $i;
            if ($this->required !== false && $i <= $this->required) {
                $id .= ':required=' . $this->defaultTexts[$i-1];
            }
            $param[] = $id;
        }
        $param = implode('_', $param);
        return $param;
    }

	//在高级联动请求出错时，必须用该方法
	public function buildFailException ($errorMessage) {
		//一旦异常，返回一个错误提示的url，需要前端做window.location.href处理
		$backUrl = urlencode(app(UrlGenerator::class)->previous());
		$res = ['status' => 'fail', 'content' => '/methodFail?msg=' . $errorMessage . '&redTo=' . $backUrl . '&linkText=返回'];
		return $res;
	}
}