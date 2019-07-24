//
//  SweeprReactViewController.swift
//  ReactTest
//
//  Created by Eoin Norris on 18/06/2019.
//  Copyright © 2019 Eoin Norris. All rights reserved.
//

import UIKit
import React
import Sweepr

// needs to be global or it will reload on every segue.
var viewFactory:SweeprReactViewControllerViewFactory?

struct SweeprReactViewControllerViewFactory {
    
    private var _rootView:RCTRootView? = nil;
    var embedded = true;

    var rootView:RCTRootView? {
        mutating get {
            if _rootView == nil {
                let embedData = ["isEmbedded": embedded]
                let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
                
                
                if let rootView = RCTRootView(
                    bundleURL: jsCodeLocation,
                    moduleName: "App",
                    initialProperties: embedData as [NSObject : Any],
                    launchOptions: nil
                    ) {
                    _rootView = rootView
                }
            }
            return _rootView;
        }
        
        set {
            if newValue == nil {
                _rootView = nil;
            }
        }
    }
}


class SweeprReactViewController: UIViewController {
    
    var sweeprCloud:SweeprCloud?

    override func viewDidLoad() {
        super.viewDidLoad()
        if viewFactory ==  nil {
            viewFactory = SweeprReactViewControllerViewFactory()
        }
        
        self.view = viewFactory!.rootView
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        // uncomment this to get the old behaviour. 
        //viewFactory?.rootView = nil
    }
    
    override func didReceiveMemoryWarning() {
        viewFactory?.rootView = nil
    }

}
