//
//  CustomUITableBarController.swift
//  ReactTest
//
//  Created by Eoin Norris on 19/06/2019.
//  Copyright © 2019 Eoin Norris. All rights reserved.
//

import UIKit

class CustomTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let vc1 = UINavigationController(rootViewController: FirstViewController())
        let vc2 = UINavigationController(rootViewController: SecondViewController())        
        viewControllers = [vc1, vc2]
    }
    
}
