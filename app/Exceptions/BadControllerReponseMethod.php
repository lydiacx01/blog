<?php
/**
 * Created by PhpStorm.
 * User: lydia
 * Date: 17-9-13
 * Time: 下午4:14
 */

namespace App\Exceptions;


class BadControllerReponseMethod extends \Exception
{
    protected $backUrl;
    protected $view;

    public function __construct($message, $backUrl = null, $view = 'errors.warning')
    {
        parent::__construct($message);
        $this->backUrl = $backUrl;
        $this->view = $view;
    }

    public function getView() {
        return $this->view;
    }

    public function getBackUrl() {
        return $this->backUrl;
    }


}