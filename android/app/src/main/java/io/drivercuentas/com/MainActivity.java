package io.drivercuentas.com;

import android.os.Bundle;
import android.view.ViewGroup;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.admob.AdMob; // Import del plugin AdMob

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Registrar el plugin de AdMob
        registerPlugin(AdMob.class);

    }
}
